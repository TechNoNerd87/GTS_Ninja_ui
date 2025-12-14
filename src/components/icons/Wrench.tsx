/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

interface Props {
  size?: string;
  color?: string;
  className?: string;
}

export function Wrench({ size = '1rem', color = '#A1A1AA', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
      viewBox="0 0 18 18"
      className={className}
      fill="none"
    >
      <path
        d="M14.25 3.75L12.75 5.25M12.75 5.25L14.25 6.75M12.75 5.25H10.5C9.25736 5.25 8.25 6.25736 8.25 7.5V8.25M3.75 14.25L5.25 12.75M5.25 12.75L3.75 11.25M5.25 12.75H7.5C8.74264 12.75 9.75 11.7426 9.75 10.5V9.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 3L3 6L6.75 9.75L9.75 6.75L6 3Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15L15 12L11.25 8.25L8.25 11.25L12 15Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
