import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function AdminDashboard({ user, onLogout }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [translating, setTranslating] = useState(false);

  const [formData, setFormData] = useState({
    name_ro: "",
    name_en: "",
    name_ru: "",
    description_ro: "",
    description_en: "",
    description_ru: "",
    price: "",
    duration_minutes: 60,
    icon: "💝",
    features_ro: [""],
    features_en: [""],
    features_ru: [""],
    is_popular: false,
    order_index: 0,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("consultation_packages")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error:", error);
      alert("Eroare la încărcarea pachetelor");
    } finally {
      setLoading(false);
    }
  };

  // Funcție de traducere automată (API gratuit MyMemory)
  const translateText = async (text, targetLang) => {
    if (!text || text.trim() === "") return "";

    try {
      const sourceLang = "ro";
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      }
      return text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  // Traduce toate câmpurile automat
  const handleAutoTranslate = async () => {
    if (!formData.name_ro || !formData.description_ro) {
      alert("⚠️ Completează mai întâi câmpurile în ROMÂNĂ!");
      return;
    }

    setTranslating(true);

    try {
      // Traduce în engleză
      const nameEn = await translateText(formData.name_ro, "en");
      const descEn = await translateText(formData.description_ro, "en");

      // Traduce features în engleză
      const featuresEn = await Promise.all(
        formData.features_ro
          .filter((f) => f.trim() !== "")
          .map((feature) => translateText(feature, "en"))
      );

      // Traduce în rusă
      const nameRu = await translateText(formData.name_ro, "ru");
      const descRu = await translateText(formData.description_ro, "ru");

      // Traduce features în rusă
      const featuresRu = await Promise.all(
        formData.features_ro
          .filter((f) => f.trim() !== "")
          .map((feature) => translateText(feature, "ru"))
      );

      // Actualizează form-ul
      setFormData({
        ...formData,
        name_en: nameEn,
        name_ru: nameRu,
        description_en: descEn,
        description_ru: descRu,
        features_en: featuresEn.length > 0 ? featuresEn : [""],
        features_ru: featuresRu.length > 0 ? featuresRu : [""],
      });

      alert("✅ Traducere completă!");
    } catch (error) {
      alert("❌ Eroare la traducere: " + error.message);
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Dacă EN/RU sunt goale, folosește RO
  const finalData = {
  ...formData,
  price: parseFloat(formData.price) || 0, // ⭐ CONVERSIE LA NUMĂR
  name_en: formData.name_en || formData.name_ro,
  name_ru: formData.name_ru || formData.name_ro,
  description_en: formData.description_en || formData.description_ro,
  description_ru: formData.description_ru || formData.description_ro,
  features_ro: formData.features_ro.filter((f) => f.trim() !== ""),
      features_en:
        formData.features_en.filter((f) => f.trim() !== "").length > 0
          ? formData.features_en.filter((f) => f.trim() !== "")
          : formData.features_ro.filter((f) => f.trim() !== ""),
      features_ru:
        formData.features_ru.filter((f) => f.trim() !== "").length > 0
          ? formData.features_ru.filter((f) => f.trim() !== "")
          : formData.features_ro.filter((f) => f.trim() !== ""),
    };

    try {
      if (editingPackage) {
        const { error } = await supabase
          .from("consultation_packages")
          .update(finalData)
          .eq("id", editingPackage.id);

        if (error) throw error;
        alert("✅ Pachet actualizat cu succes!");
      } else {
        const { error } = await supabase
          .from("consultation_packages")
          .insert([finalData]);

        if (error) throw error;
        alert("✅ Pachet adăugat cu succes!");
      }

      resetForm();
      fetchPackages();
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Eroare: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Sigur vrei să ștergi acest pachet?")) return;

    try {
      const { error } = await supabase
        .from("consultation_packages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      alert("✅ Pachet șters cu succes!");
      fetchPackages();
    } catch (error) {
      alert("❌ Eroare: " + error.message);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name_ro: pkg.name_ro,
      name_en: pkg.name_en,
      name_ru: pkg.name_ru,
      description_ro: pkg.description_ro,
      description_en: pkg.description_en,
      description_ru: pkg.description_ru,
      price: pkg.price,
      duration_minutes: pkg.duration_minutes,
      icon: pkg.icon,
      features_ro: pkg.features_ro || [""],
      features_en: pkg.features_en || [""],
      features_ru: pkg.features_ru || [""],
      is_popular: pkg.is_popular,
      order_index: pkg.order_index,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name_ro: "",
      name_en: "",
      name_ru: "",
      description_ro: "",
      description_en: "",
      description_ru: "",
      price: "",
      duration_minutes: 60,
      icon: "💝",
      features_ro: [""],
      features_en: [""],
      features_ru: [""],
      is_popular: false,
      order_index: 0,
    });
    setEditingPackage(null);
    setShowForm(false);
  };

  const addFeature = (lang) => {
    setFormData({
      ...formData,
      [`features_${lang}`]: [...formData[`features_${lang}`], ""],
    });
  };

  const removeFeature = (lang, index) => {
    const newFeatures = formData[`features_${lang}`].filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      [`features_${lang}`]: newFeatures.length > 0 ? newFeatures : [""],
    });
  };

  const updateFeature = (lang, index, value) => {
    const newFeatures = [...formData[`features_${lang}`]];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      [`features_${lang}`]: newFeatures,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            {showForm ? "❌ Anulează" : "➕ Adaugă Pachet Nou"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingPackage ? "✏️ Editează Pachet" : "➕ Pachet Nou"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nume pachete + Buton Traducere */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nume Pachet
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={translating || !formData.name_ro}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {translating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Se traduce...
                      </>
                    ) : (
                      <>🌍 Traduce automat EN + RU</>
                    )}
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🇷🇴 Română (RO) *
                    </label>
                    <input
                      type="text"
                      value={formData.name_ro}
                      onChange={(e) =>
                        setFormData({ ...formData, name_ro: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="ex: Consultație de Bază"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🇬🇧 English (EN)
                    </label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) =>
                        setFormData({ ...formData, name_en: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50"
                      placeholder="Auto-traducere sau scrie manual"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      💡 Se va traduce automat
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🇷🇺 Русский (RU)
                    </label>
                    <input
                      type="text"
                      value={formData.name_ru}
                      onChange={(e) =>
                        setFormData({ ...formData, name_ru: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50"
                      placeholder="Auto-traducere sau scrie manual"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      💡 Se va traduce automat
                    </p>
                  </div>
                </div>
              </div>

              {/* Descrieri */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🇷🇴 Descriere (RO) *
                  </label>
                  <textarea
                    value={formData.description_ro}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_ro: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🇬🇧 Description (EN)
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_en: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50"
                    rows="3"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Se va traduce automat
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🇷🇺 Описание (RU)
                  </label>
                  <textarea
                    value={formData.description_ru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_ru: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50"
                    rows="3"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Se va traduce automat
                  </p>
                </div>
              </div>

              {/* Preț, Durată, Icon */}
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preț (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durată (minute) *
                  </label>
                  <select
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="30">30 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="120">120 min</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="💝"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordine
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order_index: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Features RO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🇷🇴 Ce include (RO) *
                </label>
                {formData.features_ro.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        updateFeature("ro", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="ex: Consultație video 60 min"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature("ro", index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature("ro")}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                  ➕ Adaugă feature
                </button>
              </div>

              {/* Features EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🇬🇧 What's included (EN)
                </label>
                <p className="text-xs text-blue-600 mb-2">
                  💡 Se va completa automat la traducere
                </p>
                {formData.features_en.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        updateFeature("en", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50"
                      placeholder="Se va traduce automat"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature("en", index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature("en")}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                  ➕ Add feature
                </button>
              </div>

              {/* Features RU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🇷🇺 Что включено (RU)
                </label>
                <p className="text-xs text-blue-600 mb-2">
                  💡 Se va completa automat la traducere
                </p>
                {formData.features_ru.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        updateFeature("ru", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50"
                      placeholder="Se va traduce automat"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature("ru", index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature("ru")}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                  ➕ Добавить функцию
                </button>
              </div>

              {/* Checkbox Popular */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_popular"
                  checked={formData.is_popular}
                  onChange={(e) =>
                    setFormData({ ...formData, is_popular: e.target.checked })
                  }
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
                <label
                  htmlFor="is_popular"
                  className="text-sm font-medium text-gray-700"
                >
                  ⭐ Marchează ca POPULAR
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading
                    ? "Se salvează..."
                    : editingPackage
                    ? "💾 Salvează"
                    : "➕ Adaugă Pachet"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Packages List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            💝 Pachete de Consultație
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : packages.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              Nu există pachete. Adaugă primul pachet!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border rounded-xl p-6 hover:shadow-lg transition-all relative"
                >
                  {pkg.is_popular && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      ⭐ Popular
                    </span>
                  )}

                  <div className="text-4xl mb-4">{pkg.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {pkg.name_ro}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {pkg.description_ro}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Ce include:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {pkg.features_ro?.slice(0, 3).map((feature, i) => (
                        <li key={i}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <span className="font-bold text-pink-600 text-lg">
                      {pkg.price} €
                    </span>
                    <span>⏱️ {pkg.duration_minutes} min</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      🗑️ Șterge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
