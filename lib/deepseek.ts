import OpenAI from 'openai';

export async function callDeepSeek(
  messages: any[],
  options?: { temperature?: number; maxTokens?: number; retries?: number; timeout?: number }
) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com/v1';

  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    throw new Error('请配置 DEEPSEEK_API_KEY');
  }

  const deepseek = new OpenAI({ apiKey, baseURL, timeout: options?.timeout || 30000 });
  const retries = options?.retries ?? 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await deepseek.chat.completions.create({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2048,
      });
      return response.choices[0].message.content;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}
