// src/system/CaptionCard.tsx
// The white box. Day-agnostic: all timing arrives as 0..1 props.
import { PALETTE } from './palette';

type Props = {
  rise: number;      // 1 below frame → 0 seated
  messageIn: number; // 0..1
  creditIn: number;  // 0..1
  message: string;
  creditLine: string;
};

export const CaptionCard = ({ rise, messageIn, creditIn, message, creditLine }: Props) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      bottom: '6%',
      transform: `translateX(-50%) translateY(${rise * 130}%)`,
      width: '72%',
      backgroundColor: PALETTE.card,
      padding: '2.2em 2.6em',
      fontFamily: 'Georgia, serif',
      color: PALETTE.ink,
      fontSize: 30,
      textAlign: 'center',
    }}
  >
    <div
      style={{
        opacity: messageIn,
        letterSpacing: `${0.08 - 0.06 * messageIn}em`,
      }}
    >
      {message}
    </div>
    <div
      style={{
        opacity: creditIn * 0.55,
        fontSize: '0.55em',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginTop: '1.4em',
      }}
    >
      {creditLine}
    </div>
  </div>
);
