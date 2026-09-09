"""
NUTRI-OPTIMA — Sustainability Engine Module
Perhitungan Prototype Sustainability Score berbasis karakteristik pangan lokal:
- Indikator sederhana berbasis atribut pangan (Plant-based vs Animal protein, jejak emisi relatif, dan sumber lokal)
- BUKAN pengukuran Life Cycle Assessment (LCA) laboratoris, melainkan skor proxy edukatif untuk lomba esai.
"""

def get_sustainability_rating(score: float) -> dict:
    """Mengembalikan label dan badge status berdasarkan skor keberlanjutan 0-100."""
    if score >= 85:
        return {
            "tier": "Sangat Berkelanjutan (Eco-Friendly)",
            "color": "emerald",
            "badge": "badge-success",
            "description": "Berbasis nabati lokal, jejak emisi karbon dan pemakaian air sangat rendah."
        }
    elif score >= 70:
        return {
            "tier": "Berkelanjutan Baik",
            "color": "teal",
            "badge": "badge-info",
            "description": "Ikan tangkap lokal/unggas atau produk olahan nabati beremisi moderat."
        }
    elif score >= 50:
        return {
            "tier": "Cukup Berkelanjutan",
            "color": "amber",
            "badge": "badge-warning",
            "description": "Produk olahan telur atau unggas dengan jejak sumber daya sedang."
        }
    else:
        return {
            "tier": "Jejak Sumber Daya Tinggi",
            "color": "rose",
            "badge": "badge-danger",
            "description": "Daging merah ruminansia atau produk berintensitas karbon dan air tinggi."
        }


def calculate_meal_sustainability(food_items: list) -> float:
    """Menghitung rata-rata skor keberlanjutan dari sekumpulan item makanan."""
    if not food_items:
        return 75.0
    scores = [item.get("sustainability_score", 70) for item in food_items]
    return round(sum(scores) / len(scores), 1)
