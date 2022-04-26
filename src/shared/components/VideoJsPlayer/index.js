import React, { PureComponent } from 'react';
import { string, func, bool } from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
import 'videojs-flash';
import videoswf from 'videojs-swf/dist/video-js.swf';

import './index.less';

const videoType = 'rtmp/flv';
const playerId = 'video-js-player';

/**
 * 当url变动后，播放器会自动切换播放
 */
class VideoJsPlayer extends PureComponent {
  static propTypes = {
    url: string.isRequired,
    width: string,
    height: string,
    onPlay: func,
    onPause: func,
    onEnded: func,
    onForceReset: func,
    controls: bool,
    autoplay: bool,
    preload: bool,
    muted: bool,
    forceReset: bool, // 强制重置播放器
  }

  static defaultProps = {
    width: '100%',
    height: '100%',
    onPlay: () => {},
    onPause: () => {},
    onEnded: () => {},
    onForceReset: () => {},
    controls: true,
    autoplay: true,
    preload: true,
    muted: true,
    forceReset: false,
  }

  constructor(props) {
    super(props);
    this.player = null;
  }

  state = {
    url: 'undefined',
    forceReset: false,
  }

  componentDidMount() {
    const { url, forceReset } = this.props;
    this.videoPlay(url, forceReset);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { url, forceReset } = nextProps;
    if (url && prevState.url !== url) {
      return {
        url,
      };
    } else if (forceReset) {
      return {
        url,
        forceReset,
      };
    }
    return null;
  }

  componentDidUpdate() {
    this.videoPlay(this.state.url, this.state.forceReset);
  }

  componentWillUnmount() {
    // 销毁播放器
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }

  videoPlay = async (url, forceReset) => {
    if (url) {
      if (forceReset) {
        this.setState({ forceReset: false });
        this.props.onForceReset();
      }
      if (!this.player) {
        const {
          controls, autoplay, preload, muted,
        } = this.props;
        this.player = await videojs(playerId, {
          controls,
          preload,
          autoplay,
          techOrder: ['html5', 'flash'],
          muted,
          flash: {
            swf: videoswf,
          },
          sources: [
            {
              src: url,
              type: videoType,
            },
          ],
        });

        this.player.on('play', msg => {
          videojs.log('video play', msg);
          this.props.onPlay();
        });
        this.player.on('pause', msg => {
          videojs.log('video pause', msg);
          this.props.onPause();
        });
        this.player.on('ended', msg => {
          videojs.log('video ended', msg);
          this.props.onEnded();
        });
        this.player.on('error', error => {
          videojs.log.error('video error', error);
        });
      } else {
        try {
          this.player.reset();
          this.player.src(url);
          this.player.load(url);
          this.player.play();
        } catch (error) { // catch到error后自动重置播放器
          videojs.log.error('video error reset', error);
          this.videoPlay(url, true);
        }
      }

      videojs.log(`ready on play: ${this.player.currentSrc()}`);
    }
  }

  render() {
    const {
      width, height,
    } = this.props;

    return (
      <div className="app-videojs">
        <video id={playerId} className="video-js vjs-default-skin vjs-big-play-centered" style={{ width, height }}>
          <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a web browser that
          </p>
        </video>
      </div>
    );
  }
}

export default VideoJsPlayer;
