import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

// import './../css/scrollbar.css';

class CustomScrollbars extends Component {

    ref = React.createRef();

    scrollToBottom = () => {
        if (!this.ref || !this.ref.current) {
            return;
        }
        const scrollbars = this.ref.current;
        const originalScrollTop = scrollbars.getScrollTop();
        const targetScrollTop = scrollbars.getScrollHeight();
        this.scrollTo(originalScrollTop, targetScrollTop);
    };

    scrollTo = (originalTop, targetTop) => {
        const scrollbars = this.ref.current;
        let iteration = 0;

        const scroll = () => {
            iteration++;
            if (iteration > 30) {
                return;
            }
            scrollbars.scrollTop(originalTop + (targetTop - originalTop) / 30 * iteration);

            setTimeout(() => {
                scroll();
            }, 20);
        };

        scroll();
    };

    handleScrollStop() {
        const { onScrollStop } = this.props;
        if (onScrollStop) onScrollStop();
        this.handleScrollStopAutoHide();
    }

    renderTrackHorizontal = (props) => {
        return (
            <div {...props} className="track-horizontal" />
        );
    };

    renderTrackVertical = (props) => {
        return (
            <div {...props} className="track-vertical" />
        );
    };

    renderThumbHorizontal = (props) => {
        return (
            <div {...props}  className="thumb-horizontal" />
        );
    };

    renderThumbVertical = (props) => {
        return (
            <div {...props} className="thumb-vertical" />
        );
    };

    renderNone = (props) => {
        return (
            <div />
        );
    };

    render() {
        const { height, className, disableVerticalScroll, disableHorizontalScroll, children, ...otherProps } = this.props;
        return (
            <Scrollbars
                ref={this.ref}
                autoHide={true}
                autoHideTimeout={200}
                hideTracksWhenNotNeeded={true}
                className={className ? className + ' custom-scrollbar' : 'custom-scrollbar'}
                {...otherProps}
                renderTrackVertical={disableVerticalScroll ? this.renderNone : this.renderTrackVertical}
                renderThumbVertical={disableVerticalScroll ? this.renderNone : this.renderThumbVertical}
                style={{height: height? height:'100%'}}
            >
                {children}
                
            </Scrollbars>
        );
    }
}

export default CustomScrollbars;
