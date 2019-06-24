/*
 * blueimp Gallery Video Factory JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define, window, document */

;(function (factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) {
    // Register as an anonymous AMD module:
    define(['./blueimp-helper', './blueimp-gallery'], factory)
  } else {
    // Browser globals:
    factory(window.blueimp.helper || window.jQuery, window.blueimp.Gallery)
  }
})(function ($, Gallery) {
  'use strict'

  $.extend(Gallery.prototype.options, {
    // The class for video content elements:
    videoContentClass: 'video-content',
    // The class for video when it is loading:
    videoLoadingClass: 'video-loading',
    // The class for video when it is playing:
    videoPlayingClass: 'video-playing',
    // The list object property (or data attribute) for the video poster URL:
    videoPosterProperty: 'poster',
    // The list object property (or data attribute) for the video sources array:
    videoSourcesProperty: 'sources',
    // The location of subtitle files
    captionsProperty: 'jscaptions'
  })

  var handleSlide = Gallery.prototype.handleSlide

  $.extend(Gallery.prototype, {
    handleSlide: function (index) {
      handleSlide.call(this, index)
      if (this.playingVideo) {
        this.playingVideo.pause()
      }
    },

    videoFactory: function (obj, callback, videoInterface) {
      console.log(obj)
      
      var that = this
      var options = this.options

      console.log(options.captionsProperty);
      var videoContainerNode = this.elementPrototype.cloneNode(false)
      var videoContainer = $(videoContainerNode)
      var errorArgs = [
        {
          type: 'error',
          target: videoContainerNode
        }
      ]
      var video = videoInterface || document.createElement('video')
      video.preload="metadata"
      video.controls =""
      var url = this.getItemProperty(obj, options.urlProperty)
      var type = this.getItemProperty(obj, options.typeProperty)
      var title = this.getItemProperty(obj, options.titleProperty)
      var captionSrc = this.getItemProperty(obj, options.captionsProperty)
      //this.getItemProperty(obj, options.captionsProperty)
      console.log(captionSrc);
      console.log(options.urlProperty)
      console.log(url)
      var altText =
        this.getItemProperty(obj, this.options.altTextProperty) || title
      var posterUrl = this.getItemProperty(obj, options.videoPosterProperty)
      var posterImage
      var sources = this.getItemProperty(obj, options.videoSourcesProperty)
      var source
      var playMediaControl
      var isLoading
      var hasControls
      var sourceNode
      var track

      console.log(sources);

      videoContainer.addClass(options.videoContentClass)
      if (title) {
        videoContainerNode.title = title
      }
      if (video.canPlayType) {
        if (url && type && video.canPlayType(type)) {
              sourceNode = document.createElement("source");
              sourceNode.type = type;
              sourceNode.src = url;
              video.appendChild(sourceNode);
        } else if (sources) {
          while (sources.length) {
            source = sources.shift()
            url = this.getItemProperty(source, options.urlProperty)
            type = this.getItemProperty(source, options.typeProperty)
            if (url && type && video.canPlayType(type)) {

              sourceNode = document.createElement("source");
              sourceNode.type = type;
              sourceNode.src = url;
              video.appendChild(sourceNode);
              break
            }
          }
        }
      }
      if (captionSrc) {
              
              track = document.createElement("track");
              track.src = captionSrc;
              track.label = "english";
              track.kind = "subtitles";
              track.srclang = "en";
          
              video.appendChild(track);
        } else if (sources) {
           
          while (sources.length) {
            source = sources.shift()
            captionSrc = this.getItemProperty(source, options.captionsProperty)
            
            if (captionsSrc) {

              alert(captionSrc)
              track = document.createElement("track");
              track.src = captionSrc;
              track.label = "english";
              track.kind = "subtitles";
              track.srclang = "en";
          
              video.appendChild(track);
            }
          }
        }
          
  
      if (posterUrl) {
        video.poster = posterUrl
        posterImage = this.imagePrototype.cloneNode(false)
        $(posterImage).addClass(options.toggleClass)
        posterImage.src = posterUrl
        posterImage.draggable = false
        posterImage.alt = altText
        videoContainerNode.appendChild(posterImage)
      }
      playMediaControl = document.createElement('a')
      playMediaControl.setAttribute('target', '_blank')
      if (!videoInterface) {
        playMediaControl.setAttribute('download', title)
      }
      playMediaControl.href = url
      if (sourceNode.src) {
        video.controls = true
        ;(videoInterface || $(video))
          .on('error', function () {
            that.setTimeout(callback, errorArgs)
          })
          .on('pause', function () {
            if (video.seeking) return
            isLoading = false
            videoContainer
              .removeClass(that.options.videoLoadingClass)
              .removeClass(that.options.videoPlayingClass)
            if (hasControls) {
              that.container.addClass(that.options.controlsClass)
            }
            delete that.playingVideo
            if (that.interval) {
              that.play()
            }
          })
          .on('playing', function () {
            isLoading = false
            videoContainer
              .removeClass(that.options.videoLoadingClass)
              .addClass(that.options.videoPlayingClass)
            if (that.container.hasClass(that.options.controlsClass)) {
              hasControls = true
              that.container.removeClass(that.options.controlsClass)
            } else {
              hasControls = false
            }
          })
          .on('play', function () {
            window.clearTimeout(that.timeout)
            isLoading = true
            videoContainer.addClass(that.options.videoLoadingClass)
            that.playingVideo = video
          })
        $(playMediaControl).on('click', function (event) {
          that.preventDefault(event)
          if (isLoading) {
            video.pause()
          } else {
            video.play()
          }
        })
        videoContainerNode.appendChild(
          (videoInterface && videoInterface.element) || video
        )
      }
      videoContainerNode.appendChild(playMediaControl)
      this.setTimeout(callback, [
        {
          type: 'load',
          target: videoContainerNode
        }
      ])
      return videoContainerNode
    }
  })

  return Gallery
})
