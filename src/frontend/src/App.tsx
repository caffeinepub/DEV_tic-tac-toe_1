import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

type Cell = "X" | "O" | null;
type GameStatus = "playing" | "won" | "lost" | "draw";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

function getBestMove(board: Cell[]): number {
  // Try to win
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const vals = [board[a], board[b], board[c]];
    if (vals.filter((v) => v === "O").length === 2 && vals.includes(null)) {
      return line[vals.indexOf(null)];
    }
  }
  // Block player
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const vals = [board[a], board[b], board[c]];
    if (vals.filter((v) => v === "X").length === 2 && vals.includes(null)) {
      return line[vals.indexOf(null)];
    }
  }
  // Take center
  if (!board[4]) return 4;
  // Take corner
  const corners = [0, 2, 6, 8].filter((i) => !board[i]);
  if (corners.length)
    return corners[Math.floor(Math.random() * corners.length)];
  // Take any edge
  const edges = [1, 3, 5, 7].filter((i) => !board[i]);
  if (edges.length) return edges[Math.floor(Math.random() * edges.length)];
  // Fallback
  const empty = board
    .map((v, i) => (v === null ? i : -1))
    .filter((i) => i !== -1);
  return empty[Math.floor(Math.random() * empty.length)];
}

function Cell({
  value,
  index,
  isWinning,
  onClick,
  disabled,
}: {
  value: Cell;
  index: number;
  isWinning: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      data-ocid={`board.item.${index + 1}`}
      onClick={onClick}
      disabled={disabled || !!value}
      className={[
        "relative flex items-center justify-center",
        "aspect-square w-full text-4xl sm:text-5xl md:text-6xl font-display font-bold",
        "border-2 transition-all duration-200",
        isWinning ? "border-primary bg-primary/10" : "border-border bg-card",
        !value && !disabled
          ? "hover:border-primary/60 hover:bg-primary/5 cursor-pointer"
          : "cursor-default",
      ].join(" ")}
      aria-label={
        value ? `Cell ${index + 1}: ${value}` : `Cell ${index + 1}: empty`
      }
    >
      <AnimatePresence>
        {value && (
          <motion.span
            key={value + index}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={value === "X" ? "text-foreground" : "text-primary"}
          >
            {value}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function App() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [winLine, setWinLine] = useState<number[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const resolveGame = useCallback((newBoard: Cell[]) => {
    const result = checkWinner(newBoard);
    if (result) {
      setWinLine(result.line);
      setStatus(result.winner === "X" ? "won" : "lost");
      return true;
    }
    if (newBoard.every((c) => c !== null)) {
      setStatus("draw");
      return true;
    }
    return false;
  }, []);

  const handleCellClick = useCallback(
    (index: number) => {
      if (!isPlayerTurn || board[index] || status !== "playing" || isAiThinking)
        return;
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      if (!resolveGame(newBoard)) {
        setIsPlayerTurn(false);
      }
    },
    [board, isPlayerTurn, status, isAiThinking, resolveGame],
  );

  useEffect(() => {
    if (isPlayerTurn || status !== "playing") return;
    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const move = getBestMove(board);
      const newBoard = [...board];
      newBoard[move] = "O";
      setBoard(newBoard);
      if (!resolveGame(newBoard)) {
        setIsPlayerTurn(true);
      }
      setIsAiThinking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isPlayerTurn, board, status, resolveGame]);

  const restart = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setStatus("playing");
    setWinLine([]);
    setIsAiThinking(false);
  }, []);

  const statusLabel = {
    playing: isAiThinking
      ? "AI IS THINKING..."
      : isPlayerTurn
        ? "YOUR TURN"
        : "AI'S TURN",
    won: "YOU WIN!",
    lost: "AI WINS!",
    draw: "IT'S A DRAW",
  }[status];

  const statusColor =
    status === "won"
      ? "text-primary"
      : status === "lost"
        ? "text-destructive"
        : status === "draw"
          ? "text-muted-foreground"
          : "text-foreground";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <header className="w-full max-w-sm mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-widest text-foreground uppercase">
          TIC TAC TOE
        </h1>
        <p className="font-body text-xs text-muted-foreground tracking-widest mt-1 uppercase">
          Single Player vs AI
        </p>
      </header>

      {/* Turn indicator */}
      <div
        className="w-full max-w-sm mb-4 flex items-center gap-3"
        data-ocid="game.turn_indicator"
      >
        <div
          className={[
            "w-3 h-3 rounded-none transition-colors duration-300",
            isPlayerTurn && status === "playing" ? "bg-primary" : "bg-muted",
          ].join(" ")}
        />
        <span className="font-display text-xs tracking-widest text-muted-foreground uppercase">
          X — You
        </span>
        <span className="text-muted-foreground mx-1">vs</span>
        <div
          className={[
            "w-3 h-3 rounded-none transition-colors duration-300",
            !isPlayerTurn && status === "playing" ? "bg-primary" : "bg-muted",
          ].join(" ")}
        />
        <span className="font-display text-xs tracking-widest text-muted-foreground uppercase">
          O — AI
        </span>
      </div>

      {/* Board */}
      <div
        data-ocid="board.grid"
        className="w-full max-w-sm grid grid-cols-3 border-2 border-border"
        style={{ gap: 0 }}
      >
        {(board as Cell[]).map((cell, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Cell
            // biome-ignore lint/suspicious/noArrayIndexKey: board cells are positionally stable and never reorder
            key={`cell-pos-${i}`}
            value={cell}
            index={i}
            isWinning={winLine.includes(i)}
            onClick={() => handleCellClick(i)}
            disabled={status !== "playing" || isAiThinking}
          />
        ))}
      </div>

      {/* Status */}
      <motion.div
        key={statusLabel}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        data-ocid="game.status"
        className={`w-full max-w-sm mt-6 font-display text-2xl font-bold tracking-widest uppercase ${statusColor}`}
      >
        {statusLabel}
      </motion.div>

      {/* Restart */}
      <div className="w-full max-w-sm mt-5">
        <button
          type="button"
          data-ocid="game.restart_button"
          onClick={restart}
          className="font-display text-sm tracking-widest uppercase px-8 py-3 border-2 border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          NEW GAME
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
