import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const HeroVideo = ({ youtubeKey }) => {
    return (_jsx("div", { className: "video-container", children: _jsx("div", { className: "video-wrapper", children: youtubeKey ? (_jsx("iframe", { src: `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&controls=1&modestbranding=1`, width: "1200", height: "680", title: "YouTube video player", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true })) : (_jsxs(_Fragment, { children: [_jsx("iframe", { width: "1280", height: "680", title: "No video available", style: { backgroundColor: '#000' } }), _jsx("p", { className: "no-video-comment", children: "\u203B \u3053\u306E\u6620\u753B\u306E\u4E88\u544A\u52D5\u753B\u306F\u73FE\u5728\u5229\u7528\u3067\u304D\u307E\u305B\u3093" })] })) }) }));
};
export default HeroVideo;
