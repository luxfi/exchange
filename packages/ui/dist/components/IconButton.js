import { styled } from '@tamagui/core';
import { Stack } from 'tamagui';
export const IconButton = styled(Stack, {
    name: 'IconButton',
    tag: 'button',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$2',
    cursor: 'pointer',
    pressStyle: {
        opacity: 0.8,
        scale: 0.95,
    },
    hoverStyle: {
        backgroundColor: '$backgroundHover',
    },
    focusStyle: {
        outlineWidth: 2,
        outlineColor: '$primary',
        outlineStyle: 'solid',
    },
    disabledStyle: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    variants: {
        variant: {
            default: {
                backgroundColor: 'transparent',
            },
            filled: {
                backgroundColor: '$secondary',
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '$borderColor',
            },
        },
        size: {
            sm: {
                width: 28,
                height: 28,
            },
            md: {
                width: 36,
                height: 36,
            },
            lg: {
                width: 44,
                height: 44,
            },
        },
        circular: {
            true: {
                borderRadius: '$round',
            },
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});
