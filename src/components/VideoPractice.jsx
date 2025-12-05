import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function VideoPractice() {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const categories = [
    { id: 'all', icon: '🎬', label: t('videos.categories.all') },
    { id: 'positions', icon: '👶', label: t('videos.categories.positions') },
    { id: 'latch', icon: '🤱', label: t('videos.categories.latch') },
    { id: 'massage', icon: '💆‍♀️', label: t('videos.categories.massage') },
    { id: 'problems', icon: '🩹', label: t('videos.categories.problems') },
    { id: 'pumping', icon: '🍼', label: t('videos.categories.pumping') },
    { id: 'care', icon: '💝', label: t('videos.categories.care') }
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const getLocalizedContent = (video, field) => {
    const lang = i18n.language;
    return video[`${field}_${lang}`] || video[`${field}_ro`];
  };

  const extractYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const getVideoThumbnail = (video) => {
    if (video.thumbnail_url) {
      return video.thumbnail_url;
    }
    if (video.video_type === 'youtube' && video.youtube_url) {
      const youtubeId = extractYouTubeID(video.youtube_url);
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    return null;
  };

  const getVideoSource = (video) => {
    if (video.video_type === 'youtube' && video.youtube_url) {
      const youtubeId = extractYouTubeID(video.youtube_url);
      return {
        type: 'youtube',
        id: youtubeId,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
      };
    } else if (video.video_type === 'upload' && video.video_url) {
      return {
        type: 'upload',
        url: video.video_url
      };
    }
    return null;
  };

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  if (loading) {
    return (
      <section id="videos" className="relative py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-gray-600">Se încarcă videoclipurile...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="relative py-20 bg-gradient-to-b from-white to-pink-50 overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white backdrop-blur px-4 py-2 rounded-full shadow-md mb-4">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-700">🎥 {t('videos.badge')}</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#8B4513] leading-tight mb-4">
            {t('videos.title')}<br />
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {t('videos.titleHighlight')}
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('videos.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => {
            const thumbnail = getVideoThumbnail(video);
            const title = getLocalizedContent(video, 'title');
            const description = getLocalizedContent(video, 'description');

            return (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden aspect-video bg-gray-200">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-4xl text-gray-500">🎥</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <svg className="w-8 h-8 text-pink-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-xl text-gray-600">{t('videos.noVideos')}</p>
          </div>
        )}
      </div>

      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative bg-white rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="aspect-video bg-black">
              {(() => {
                const videoSource = getVideoSource(selectedVideo);
                if (videoSource?.type === 'youtube') {
                  return (
                    <iframe
                      className="w-full h-full"
                      src={videoSource.embedUrl}
                      title={getLocalizedContent(selectedVideo, 'title')}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  );
                } else if (videoSource?.type === 'upload') {
                  return (
                    <video
                      className="w-full h-full"
                      controls
                      autoPlay
                      src={videoSource.url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  );
                } else {
                  return (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <p>Video indisponibil</p>
                    </div>
                  );
                }
              })()}
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {getLocalizedContent(selectedVideo, 'title')}
              </h3>
              <p className="text-gray-600">
                {getLocalizedContent(selectedVideo, 'description')}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default VideoPractice;