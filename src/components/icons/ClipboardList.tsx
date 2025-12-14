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

export function ClipboardList({ size = '1rem', color = '#A1A1AA', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
      viewBox="0 0 18 18"
      className={className}
      fill="none"
    >
      <path
        d="M6 3H4.5C3.67157 3 3 3.67157 3 4.5V15C3 15.8284 3.67157 16.5 4.5 16.5H13.5C14.3284 16.5 15 15.8284 15 15V4.5C15 3.67157 14.3284 3 13.5 3H12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 1.5H7.5C6.67157 1.5 6 2.17157 6 3V3.75C6 4.16421 6.33579 4.5 6.75 4.5H11.25C11.6642 4.5 12 4.16421 12 3.75V3C12 2.17157 11.3284 1.5 10.5 1.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 7.5H12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10.5H12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 13.5H9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
