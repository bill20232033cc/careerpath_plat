import OpenAI from 'openai';

export async function callDeepSeek(messages: any[], options?: any) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com/v1';

  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    throw new Error('请配置 DEEPSEEK_API_KEY');
  }

  const deepseek = new OpenAI({ apiKey, baseURL });

  const response = await deepseek.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    messages,
    temperature: options?.temperature || 0.7,
    max_tokens: options?.maxTokens || 2048,
    ...options,
  });

  return response.choices[0].message.content;
}
