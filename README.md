# Simple Relative Date Input

A React component for entering relative dates using Grafana-like syntax. Includes a recursive descent parser built on a [formal EBNF grammar](src/model/EBNF.txt).

## Syntax

```
now[-+/][number]<unit>
```

**Time units:**
| Unit | Description |
|------|-------------|
| `s` | seconds |
| `m` | minutes |
| `h` | hours |
| `d` | days |
| `w` | weeks |
| `M` | months |
| `Q` | quarters |
| `y` | years |

**Operations:**

- `-` — subtract time
- `+` — add time
- `/` — round to the start of period

**Examples:**

| Expression  | Result                 |
| ----------- | ---------------------- |
| `now`       | current time           |
| `now-1h`    | 1 hour ago             |
| `now-7d`    | 7 days ago             |
| `now/d`     | start of today         |
| `now-1d/d`  | start of yesterday     |
| `now/M`     | start of current month |
| `now-1w+2d` | 1 week ago plus 2 days |

## Installation & Running

```bash
pnpm install
pnpm dev
```

## Tests

```bash
pnpm test
```

## Stack

- React 19
- TypeScript
- Vite
