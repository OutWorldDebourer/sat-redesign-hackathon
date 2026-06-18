import { describe, expect, it } from "vitest";
import { scrubLine, scrubReasoningChunk } from "./sseScrub";

// Bloque SSE realista: deltas de razonamiento (modo pensar) + content + [DONE].
const SSE_THINK =
  'data: {"choices":[{"delta":{"role":"assistant","content":null,"reasoning_content":""}}]}\n\n' +
  'data: {"choices":[{"delta":{"content":null,"reasoning_content":"We"}}]}\n\n' +
  'data: {"choices":[{"delta":{"content":null,"reasoning_content":" need to answer"}}]}\n\n' +
  'data: {"choices":[{"delta":{"content":"Hola"}}]}\n\n' +
  'data: {"choices":[{"delta":{"content":", soy el asistente."}}]}\n\n' +
  "data: [DONE]\n\n";

describe("scrubReasoningChunk", () => {
  it("elimina la clave reasoning_content y sus tokens del output", () => {
    const { output } = scrubReasoningChunk(SSE_THINK);
    expect(output).not.toContain("reasoning_content");
    expect(output).not.toContain("need to answer");
    expect(output).not.toContain("We");
  });

  it("preserva el contenido visible (content)", () => {
    const { output } = scrubReasoningChunk(SSE_THINK);
    expect(output).toContain('"content":"Hola"');
    expect(output).toContain(', soy el asistente.');
  });

  it("preserva el marcador [DONE]", () => {
    const { output } = scrubReasoningChunk(SSE_THINK);
    expect(output).toContain("data: [DONE]");
  });

  it("no altera una linea de solo-content (sin reasoning_content)", () => {
    const line = 'data: {"choices":[{"delta":{"content":"Hola"}}]}';
    const { output } = scrubReasoningChunk(line + "\n");
    expect(output).toBe(line + "\n");
  });

  it("conserva la linea parcial final en remainder hasta el siguiente chunk", () => {
    const input = 'data: {"choices":[{"delta":{"content":"Hi"}}]}\ndata: {"cho';
    const { output, remainder } = scrubReasoningChunk(input);
    expect(output).toBe('data: {"choices":[{"delta":{"content":"Hi"}}]}\n');
    expect(remainder).toBe('data: {"cho');
  });

  it("reensambla una linea partida entre dos chunks sin perder content", () => {
    const part1 = 'data: {"choices":[{"delta":{"content":"par';
    const a = scrubReasoningChunk(part1);
    expect(a.output).toBe("");
    const b = scrubReasoningChunk(a.remainder + 'cial"}}]}\n');
    expect(b.output).toContain('"content":"parcial"');
    expect(b.output).not.toContain("reasoning_content");
  });
});

describe("scrubLine", () => {
  it("quita reasoning_content dejando el resto del delta intacto", () => {
    const line = 'data: {"choices":[{"delta":{"role":"assistant","content":null,"reasoning_content":"interno"}}]}';
    const out = scrubLine(line);
    expect(out).not.toContain("reasoning_content");
    expect(out).not.toContain("interno");
    expect(out).toContain('"role":"assistant"');
    expect(JSON.parse(out.slice(5)).choices[0].delta).toEqual({ role: "assistant", content: null });
  });

  it("preserva [DONE], lineas en blanco y eventos no-data", () => {
    expect(scrubLine("data: [DONE]")).toBe("data: [DONE]");
    expect(scrubLine("")).toBe("");
    expect(scrubLine(": comentario keep-alive")).toBe(": comentario keep-alive");
  });

  it("ante data no parseable que menciona reasoning_content, lo neutraliza", () => {
    const out = scrubLine('data: {"reasoning_content": roto');
    expect(out).not.toContain("roto");
    expect(out).not.toContain("reasoning_content");
  });
});
