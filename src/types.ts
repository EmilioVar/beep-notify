import { ContainerPosition } from "./ui/Containers/ToastContainer";

export type BeepType = "success" | "error" | "info" | "warning" | "danger";

export interface ToastOptions {
    title?: string;
    message: string;
    type?: BeepType;
    position?: ContainerPosition;
    duration?: number | null;
    sound?: boolean;
    options?: {
        html?: boolean;
        closeButton?: boolean;
        stopOnHover?: boolean;
        showProgressBar?: boolean;
    };
}

export interface ActionOptions {
    message: string;
    type?: BeepType;
    position?: ContainerPosition;
    acceptText?: string;
    rejectText?: string;
    duration?: number | null;
    html?: boolean;
    options?: {
        reverseButtons?: boolean;
    };
    onAccept?: () => void;
    onReject?: () => void;
    onTimeout?: () => void;
}