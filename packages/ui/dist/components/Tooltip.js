import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip as TTooltip, styled, Paragraph } from 'tamagui';
const TooltipContent = styled(TTooltip.Content, {
    name: 'TooltipContent',
    backgroundColor: '$background',
    borderRadius: '$2',
    paddingHorizontal: '$3',
    paddingVertical: '$2',
    borderWidth: 1,
    borderColor: '$borderColor',
    enterStyle: { x: 0, y: -5, opacity: 0, scale: 0.9 },
    exitStyle: { x: 0, y: -5, opacity: 0, scale: 0.9 },
    animation: [
        'quick',
        {
            opacity: {
                overshootClamping: true,
            },
        },
    ],
});
const TooltipArrow = styled(TTooltip.Arrow, {
    name: 'TooltipArrow',
});
export function Tooltip({ content, children, delay = 300 }) {
    return (_jsxs(TTooltip, { delay: delay, children: [_jsx(TTooltip.Trigger, { asChild: true, children: children }), _jsxs(TooltipContent, { children: [_jsx(TooltipArrow, {}), _jsx(Paragraph, { size: "$2", children: content })] })] }));
}
