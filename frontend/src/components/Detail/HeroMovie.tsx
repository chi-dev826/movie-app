type Props = {
  youtubeKey: string | null;
};

const HeroVideo = ({ youtubeKey }: Props) => {
  return (
    <div className="video-container">
      <div className="video-wrapper">
        {youtubeKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=0&mute=0&rel=0&modestbranding=1&showinfo=0&controls=1&modestbranding=1`}
            width="1200"
            height="680"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <iframe
              width="1280"
              height="680"
              title="No video available"
              style={{ backgroundColor: '#000' }}
            />
            <p className="no-video-comment">※ この映画の予告動画は現在利用できません</p>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroVideo;
