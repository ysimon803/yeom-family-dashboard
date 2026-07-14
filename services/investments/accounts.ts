export function getAccountName(ticker: string) {

  const names: Record<string, string> = {

    FXAIX: "Fidelity 500 Index Fund",

    QQQM: "Invesco NASDAQ 100 ETF",

    SOXX: "iShares Semiconductor ETF",

    VOO: "Vanguard S&P 500 ETF",

    SCHD: "Schwab Dividend ETF",

    VXUS: "Vanguard Total International",

  };

  return names[ticker] ?? ticker;

}