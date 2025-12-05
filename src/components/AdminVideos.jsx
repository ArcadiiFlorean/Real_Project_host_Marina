import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title_ro: '',
    title_en: '',
    title_ru: '',
    description_ro: '',
    description_en: '',
    description_ru: '',
    category: 'positions',
    duration: '',
    video_type: 'youtube',
    youtube_url: '',
    video_file: null,
    thumbnail_file: null,
    order_index: 0,
    is_active: true
  });

  const categories = [
    { value: 'positions', label: 'Poziții' },
    { value: 'latch', label: 'Atașare' },
    { value: 'massage', label: 'Masaj' },
    { value: 'problems', label: 'Probleme' },
    { value: 'pumping', label: 'Extragere' },
    { value: 'care', label: 'Îngrijire' }
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
      alert('Eroare la încărcarea videoclipurilor');
    } else {
      setVideos(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const extractYouTubeID = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const uploadFile = async (file, path) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);

    try {
      let videoUrl = null;
      let thumbnailUrl = null;
      let youtubeId = null;

      // Upload video file sau procesează YouTube URL
      if (formData.video_type === 'upload' && formData.video_file) {
        setUploadProgress(30);
        videoUrl = await uploadFile(formData.video_file, 'videos');
        setUploadProgress(50);
      } else if (formData.video_type === 'youtube' && formData.youtube_url) {
        youtubeId = extractYouTubeID(formData.youtube_url);
        if (!youtubeId) {
          alert('Link YouTube invalid!');
          setUploading(false);
          return;
        }
        thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      }

      // Upload thumbnail (optional pentru upload, override pentru YouTube)
      if (formData.thumbnail_file) {
        setUploadProgress(70);
        thumbnailUrl = await uploadFile(formData.thumbnail_file, 'thumbnails');
      }

      setUploadProgress(90);

      const videoData = {
        title_ro: formData.title_ro,
        title_en: formData.title_en,
        title_ru: formData.title_ru,
        description_ro: formData.description_ro,
        description_en: formData.description_en,
        description_ru: formData.description_ru,
        category: formData.category,
        duration: formData.duration,
        video_type: formData.video_type,
        youtube_url: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        order_index: parseInt(formData.order_index),
        is_active: formData.is_active
      };

      let result;
      if (editingVideo) {
        result = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', editingVideo.id);
      } else {
        result = await supabase
          .from('videos')
          .insert([videoData]);
      }

      if (result.error) throw result.error;

      alert(editingVideo ? 'Videoclip actualizat!' : 'Videoclip adăugat!');
      resetForm();
      fetchVideos();
    } catch (error) {
      console.error('Error:', error);
      alert('Eroare: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title_ro: video.title_ro,
      title_en: video.title_en,
      title_ru: video.title_ru,
      description_ro: video.description_ro,
      description_en: video.description_en,
      description_ru: video.description_ru,
      category: video.category,
      duration: video.duration,
      video_type: video.video_type,
      youtube_url: video.youtube_url || '',
      video_file: null,
      thumbnail_file: null,
      order_index: video.order_index,
      is_active: video.is_active
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Sigur vrei să ștergi acest videoclip?')) return;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Eroare la ștergere: ' + error.message);
    } else {
      alert('Videoclip șters!');
      fetchVideos();
    }
  };

  const resetForm = () => {
    setFormData({
      title_ro: '',
      title_en: '',
      title_ru: '',
      description_ro: '',
      description_en: '',
      description_ru: '',
      category: 'positions',
      duration: '',
      video_type: 'youtube',
      youtube_url: '',
      video_file: null,
      thumbnail_file: null,
      order_index: 0,
      is_active: true
    });
    setEditingVideo(null);
    setIsAdding(false);
  };

  if (loading) {
    return <div className="text-center py-8">Se încarcă...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestionare Videoclipuri</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          {isAdding ? '✕ Închide' : '+ Adaugă Videoclip'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {editingVideo ? 'Editează Videoclip' : 'Adaugă Videoclip Nou'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Video Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tip Videoclip *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="video_type"
                    value="youtube"
                    checked={formData.video_type === 'youtube'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>🎥 YouTube</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="video_type"
                    value="upload"
                    checked={formData.video_type === 'upload'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>📤 Upload Video</span>
                </label>
              </div>
            </div>

            {/* YouTube URL */}
            {formData.video_type === 'youtube' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link YouTube *</label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleChange}
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-xs text-gray-500 mt-1">Thumbnail-ul va fi generat automat de la YouTube</p>
              </div>
            )}

            {/* Video File Upload */}
            {formData.video_type === 'upload' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Încarcă Video * (MP4, MOV, AVI)</label>
                <input
                  type="file"
                  name="video_file"
                  accept="video/*"
                  onChange={handleChange}
                  required={!editingVideo}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-xs text-gray-500 mt-1">Mărime maximă recomandată: 100MB</p>
              </div>
            )}

            {/* Thumbnail Upload (optional for upload, override for YouTube) */}
            {formData.video_type === 'upload' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (JPG, PNG)</label>
                <input
                  type="file"
                  name="thumbnail_file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorie *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durată (ex: 5:30)</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="5:30"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Titles */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titlu RO *</label>
                <input
                  type="text"
                  name="title_ro"
                  value={formData.title_ro}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titlu EN</label>
                <input
                  type="text"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titlu RU</label>
                <input
                  type="text"
                  name="title_ru"
                  value={formData.title_ru}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descriere RO *</label>
                <textarea
                  name="description_ro"
                  value={formData.description_ro}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descriere EN</label>
                <textarea
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descriere RU</label>
                <textarea
                  name="description_ru"
                  value={formData.description_ru}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>
            </div>

            {/* Order & Active */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordine (sortare)</label>
                <input
                  type="number"
                  name="order_index"
                  value={formData.order_index}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">Activ (vizibil pe site)</label>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Se încarcă...</span>
                  <span className="text-sm font-medium text-blue-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Se încarcă...' : (editingVideo ? '✓ Actualizează' : '+ Adaugă Videoclip')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-200">
              {video.thumbnail_url ? (
                <img src={video.thumbnail_url} alt={video.title_ro} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">🎥</span>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
                {categories.find(c => c.value === video.category)?.label}
              </div>
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              )}
              {!video.is_active && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold">INACTIV</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{video.title_ro}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description_ro}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <span className={video.video_type === 'youtube' ? 'text-red-500' : 'text-blue-500'}>
                  {video.video_type === 'youtube' ? '▶️ YouTube' : '📤 Upload'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(video)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all text-sm"
                >
                  ✏️ Editează
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all text-sm"
                >
                  🗑️ Șterge
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && !isAdding && (
        <div className="text-center py-16 bg-white rounded-xl">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-xl text-gray-600 mb-4">Niciun videoclip adăugat încă</p>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            + Adaugă Primul Videoclip
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminVideos;