import { jsx as _jsx } from "react/jsx-runtime";
import { styled, Stack } from 'tamagui';
const SpinnerFrame = styled(Stack, {
    name: 'Spinner',
    borderWidth: 2,
    borderColor: '$borderColor',
    borderTopColor: '$primary',
    borderRadius: 1000,
    animation: 'lazy',
    rotate: '0deg',
    variants: {
        size: {
            sm: {
                width: 16,
                height: 16,
                borderWidth: 2,
            },
            md: {
                width: 24,
                height: 24,
                borderWidth: 2,
            },
            lg: {
                width: 32,
                height: 32,
                borderWidth: 3,
            },
            xl: {
                width: 48,
                height: 48,
                borderWidth: 4,
            },
        },
    },
    defaultVariants: {
        size: 'md',
    },
});
export function Spinner(props) {
    return _jsx(SpinnerFrame, { ...props });
}
