import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Router } from 'wouter';
import { describe, expect, it } from 'vitest';
import App from '../App';
import CommandCenterPage from '../pages/command-center';
import AiDecisionsPage from '../pages/ai-decisions';
import TradeActivityPage from '../pages/trade-activity';
import TradePlansPage from '../pages/trade-plans';
import ConversationReplayPage from '../pages/conversation-replay';

describe('standalone presentation', () => {
  for (const [name, Page, marker] of [
    ['Command Center', CommandCenterPage, 'page-command-center'],
    ['AI Decisions', AiDecisionsPage, 'page-ai-decisions'],
    ['Trade Activity', TradeActivityPage, 'page-trade-activity'],
    ['Active Trade Plans', TradePlansPage, 'card-plan-demo-plan'],
    ['Conversation Replay', ConversationReplayPage, 'panel-replay-selector'],
  ] as const) {
    it(`renders ${name} from bundled data without a backend`, () => {
      const html = renderToStaticMarkup(createElement(Router, { ssrPath: '/', children: createElement(Page) }));
      expect(html).toContain(marker);
      expect(html.toLowerCase()).toMatch(/synthetic|fictional|demo/);
      expect(html).not.toMatch(/phase-[246]-conversation|claude-sonnet-4-6|conv-paper-aapl-0214/);
    });
  }

  it('keeps the synthetic banner and all five navigation destinations', () => {
    const html = renderToStaticMarkup(createElement(App));
    expect(html).toContain('banner-synthetic-demo');
    for (const id of ['overview', 'decisions', 'activity', 'plans', 'replay']) {
      expect(html).toContain(`data-testid="link-${id}"`);
    }
  });
});
