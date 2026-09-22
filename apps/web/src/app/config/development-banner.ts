export function printDevelopmentBanner(): void {
  if (!import.meta.env.DEV) return;

  console.info(
    '%c NORTHSTAR %c DEVELOPMENT %c\nWeb: http://localhost:5173\nAPI: http://localhost:3000/api/v1',
    'background:#087f5b;color:white;font-weight:700;padding:4px 8px;border-radius:4px 0 0 4px',
    'background:#d3f9d8;color:#075f45;font-weight:700;padding:4px 8px;border-radius:0 4px 4px 0',
    'color:inherit;line-height:1.7',
  );
}
