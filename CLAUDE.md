- use pnpm

## UI Styling Guidelines

### Buttons
All buttons should follow the standard gray styling unless otherwise specified:
- Background: `bg-gray-600 hover:bg-gray-500`
- Text size: `text-sm`
- Padding: `px-3 py-1` for standard buttons, or custom sizing as needed
- Border radius: `rounded`
- Transitions: `transition-colors`

Example standard button:
```tsx
<button className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors">
  Button Text
</button>
```