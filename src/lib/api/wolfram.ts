import { Paper } from '@/types';

const WOLFRAM_API_URL = 'http://api.wolframalpha.com/v2/query';

export async function searchWolfram(
  query: string,
  appId: string
): Promise<Paper[]> {
  try {
    const params = new URLSearchParams({
      input: query,
      appid: appId,
      format: 'plaintext',
      output: 'JSON',
      reinterpret: 'true'
    });

    const response = await fetch(`${WOLFRAM_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`WolframAlpha API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.queryresult || data.queryresult.success !== 'true') {
      return [];
    }

    const pods = data.queryresult.pods || [];
    const papers: Paper[] = [];

    // Extract information from relevant pods
    pods.forEach((pod: any) => {
      if (pod.subpods && pod.subpods.length > 0) {
        const content = pod.subpods
          .map((sub: any) => sub.plaintext)
          .filter(Boolean)
          .join('\n');

        if (content) {
          papers.push({
            id: generateId(),
            title: pod.title || 'WolframAlpha Result',
            authors: ['WolframAlpha Computational Engine'],
            abstract: content,
            url: `https://www.wolframalpha.com/input?i=${encodeURIComponent(query)}`,
            source: 'wolfram',
            category: pod.scanner || 'computation'
          });
        }
      }
    });

    return papers;
  } catch (error) {
    console.error('WolframAlpha search error:', error);
    return [];
  }
}

export async function computeQuery(
  query: string,
  appId: string
): Promise<{ result: string; pods: any[] } | null> {
  try {
    const params = new URLSearchParams({
      input: query,
      appid: appId,
      format: 'plaintext',
      output: 'JSON',
      reinterpret: 'true'
    });

    const response = await fetch(`${WOLFRAM_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`WolframAlpha API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.queryresult || data.queryresult.success !== 'true') {
      return null;
    }

    const pods = data.queryresult.pods || [];
    const primaryPod = pods.find((p: any) => p.primary === 'true');
    
    return {
      result: primaryPod?.subpods?.[0]?.plaintext || 'No result found',
      pods: pods
    };
  } catch (error) {
    console.error('WolframAlpha compute error:', error);
    return null;
  }
}

function generateId(): string {
  return 'wolfram-' + Math.random().toString(36).substring(2, 15);
}
