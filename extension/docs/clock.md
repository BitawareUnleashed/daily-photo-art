

## Key Features
- **Real-time clock display** with automatic updates
- **Animated colon blink**: The colon between hours and minutes blinks with a 50% duty cycle, managed by a CSS animation for smooth and efficient visual feedback.

## Core Function

### `tickClock()`
**Purpose**: Updates the digital clock display with the current time (HH:MM, 24-hour format).

**Details**:
- Gets current date/time
- Formats time to HH:MM (zero-padded)
- Updates the `#clock` DOM element
- Called every second by a timer in `main.js`
- The colon blink is handled entirely by CSS (no JavaScript logic)

**Example Output**: `14:32`, `09:15`, `23:59`

## CSS Animation

- The colon (`:`) between hours and minutes uses a CSS keyframes animation (`blinkColon`) to alternate its opacity.
- The duty cycle is 50%: the colon is visible for half the time and hidden for the other half.
- No JavaScript is used for the animation.

## Integration

- The `tickClock` function is called by `main.js` every second to keep the time updated.
- The only export from `clock.js` is `tickClock`.

## Future Enhancements
- **Custom Time Zones**: User-specified timezone display
- **Date Display**: Optional date alongside time
- **Animation Customization**: User-defined colon blink speed or style
- **Quotes**: `loadQuote()` - Daily quote display
