import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/locales/translations";
import { Award, ExternalLink, Calendar, X, Clock, User, Building } from "lucide-react";

interface Badge {
  id: string;
  issued_at_date: string;
  expires_at_date: string;
  issued_to: string;
  image_url: string;
  badge_template: {
    name: string;
    description: string;
  };
  issuer: {
    // entities:[{
    //     name: string;
    // }]
    summary: string;
  };
}

interface CredlyResponse {
  data: Badge[];
  metadata: {
    count: number;
    total_count: number;
  };
}

const Certifications: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/badges/badges.json");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CredlyResponse = await response.json();
        setBadges(data.data);
      } catch (err) {
        console.error('Error fetching badges:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch badges');
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "ar" ? "ar-SA" : "en-US",
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    );
  };

  const openModal = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBadge(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (loading) {
    return (
      <section className="my-12">
        <h2 className="section-heading">{t.certifications}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg border p-6 animate-pulse">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-muted rounded-full"></div>
              </div>
              <div className="h-6 bg-muted rounded mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-12">
        <h2 className="section-heading">{t.certifications}</h2>
        <div className="text-center py-12">
          <Award size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load certifications</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="my-12">
        <h2 className="section-heading">{t.certifications}</h2>
        <p className="text-muted-foreground mb-8">{t.certificationsDescription}</p>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="group bg-card rounded-lg border p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
                onClick={() => openModal(badge)}
              >
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={badge.image_url}
                    alt={badge.badge_template.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-center group-hover:text-primary transition-colors">
                  {badge.badge_template.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 text-center line-clamp-3">
                  {badge.badge_template.description}
                </p>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    <span>Issued: {formatDate(badge.issued_at_date)}</span>
                  </div>
                  {badge.expires_at_date && (
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>Expires: {formatDate(badge.expires_at_date)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Award size={12} />
                    <span>{badge.issuer.summary}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                    Click to view details
                    <ExternalLink size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No certifications found</h3>
            <p className="text-muted-foreground">Check back later for new certifications</p>
          </div>
        )}
      </section>

      {/* Modal */}
      {isModalOpen && selectedBadge && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-background rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold">{selectedBadge.badge_template.name}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Badge Image */}
              <div className="flex justify-center mb-6">
                <img
                  src={selectedBadge.image_url}
                  alt={selectedBadge.badge_template.name}
                  className="w-32 h-32 object-contain"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedBadge.badge_template.description}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Issued to:</span>
                    <p className="font-medium">{selectedBadge.issued_to}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building size={16} className="text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Issuer:</span>
                    <p className="font-medium">{selectedBadge.issuer.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Issue Date:</span>
                    <p className="font-medium">{formatDate(selectedBadge.issued_at_date)}</p>
                  </div>
                </div>

                {selectedBadge.expires_at_date && (
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">Expires:</span>
                      <p className="font-medium">{formatDate(selectedBadge.expires_at_date)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <a
                  href={`https://www.credly.com/badges/${selectedBadge.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View on Credly
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Certifications; 