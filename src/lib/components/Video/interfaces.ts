import type { VideoPlayerMode, VideoPlayerRenderView } from './enums';

export interface VideoPlayerProps {
	id: string;
	src: string;
	poster: string;
	threshold?: number;
	muted?: boolean;
	controls?: boolean;
	onPlay?: () => void;
	onPause?: () => void;
	onClick?: () => void;
	onVideoEnd?: () => void;
	type?: VideoPlayerMode;
	showBottomDrawer?: boolean;
	fullScreen?: boolean;
	onClose?: () => void;
	header?: string;
	footer?: string;
	playInLoop?: boolean;
	showInModal?: boolean;
	autoplay?: boolean;
	source?: VideoPlayerRenderView;
	hideMute?: boolean;
	fallbackSrc?: string;
	autoPlayOnFocus?: boolean;
}
