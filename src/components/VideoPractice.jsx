import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

function VideoPractice() {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const categories = [
    {
      id: "all",
      label: t("videos.categories.all"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "positions",
      label: t("videos.categories.positions"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "latch",
      label: t("videos.categories.latch"),
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: "massage",
      label: t("videos.categories.massage"),
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: "problems",
      label: t("videos.categories.problems"),
      gradient: "from-red-500 to-pink-500",
    },
    {
      id: "pumping",
      label: t("videos.categories.pumping"),
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: "care",
      label: t("videos.categories.care"),
      gradient: "from-teal-500 to-emerald-500",
    },
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching videos:", error);
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
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const getVideoThumbnail = (video) => {
    if (video.thumbnail_url) {
      return video.thumbnail_url;
    }
    if (video.video_type === "youtube" && video.youtube_url) {
      const youtubeId = extractYouTubeID(video.youtube_url);
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    return null;
  };

  const getVideoSource = (video) => {
    if (video.video_type === "youtube" && video.youtube_url) {
      const youtubeId = extractYouTubeID(video.youtube_url);
      return {
        type: "youtube",
        id: youtubeId,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1`,
      };
    } else if (video.video_type === "upload" && video.video_url) {
      return {
        type: "upload",
        url: video.video_url,
      };
    }
    return null;
  };

  const filteredVideos =
    selectedCategory === "all"
      ? videos
      : videos.filter((video) => video.category === selectedCategory);

  if (loading) {
    return (
      <section
        id="videos"
        className="relative py-20 bg-gradient-to-b from-white to-pink-50"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block rounded-full h-12 w-12 border-b-2 border-pink-500"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-600"
            >
              Se încarcă videoclipurile...
            </motion.p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="videos"
      className="relative py-20 bg-gradient-to-b from-white to-pink-50 overflow-hidden"
    >
      {/* Animated background blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 w-72 h-72 bg-pink-200 rounded-full opacity-20 blur-3xl"
      ></motion.div>
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl"
      ></motion.div>

      <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white backdrop-blur px-4 py-2 rounded-full shadow-md mb-4"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-pink-500 rounded-full"
            ></motion.span>
            <span className="text-sm text-gray-700">{t("videos.badge")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-[#8B4513] leading-tight mb-4"
          >
            {t("videos.title")}
            <br />
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {t("videos.titleHighlight")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {t("videos.subtitle")}
          </motion.p>
        </div>

        {/* Categories - New Modern Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`relative px-6 py-3 rounded-full font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 ${
                selectedCategory === category.id
                  ? "text-white shadow-xl"
                  : "bg-white text-gray-700 hover:shadow-lg border-2 border-gray-200 hover:border-gray-300"
              }`}
            >
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className={`absolute inset-0 bg-gradient-to-r ${category.gradient}`}
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{category.label}</span>

              {selectedCategory === category.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Videos Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredVideos.map((video, index) => {
              const thumbnail = getVideoThumbnail(video);
              const title = getLocalizedContent(video, "title");
              const description = getLocalizedContent(video, "description");

              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => setSelectedVideo(video)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative overflow-hidden aspect-video bg-gray-200">
                    {thumbnail ? (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <svg
                          className="w-16 h-16 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center"
                      >
                        <motion.svg
                          animate={{ x: [0, 2, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-8 h-8 text-pink-500 ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </motion.svg>
                      </motion.div>
                    </div>
                    {video.duration && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded"
                      >
                        {video.duration}
                      </motion.div>
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
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* No Videos Message */}
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              <svg
                className="w-24 h-24 mx-auto text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
            <p className="text-xl text-gray-600">{t("videos.noVideos")}</p>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, type: "spring", damping: 25 }}
              className="relative bg-white rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="aspect-video bg-black"
              >
                {(() => {
                  const videoSource = getVideoSource(selectedVideo);
                  if (videoSource?.type === "youtube") {
                    return (
                      <iframe
                        className="w-full h-full"
                        src={videoSource.embedUrl}
                        title={getLocalizedContent(selectedVideo, "title")}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    );
                  } else if (videoSource?.type === "upload") {
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {getLocalizedContent(selectedVideo, "title")}
                </h3>
                <p className="text-gray-600">
                  {getLocalizedContent(selectedVideo, "description")}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default VideoPractice;
