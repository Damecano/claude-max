# Rezinka — Uzum kartochkasi uchun 8 ta slayd

Tayyor rasmlar: `output/01_oblozhka.png` … `output/08_razmery.png` (1080×1440 PNG).
Hammasi bitta arxivda: `Rezinka_slaydlar_1080x1440.zip`.

Uslub: «ATHLETIX Signal» — oq fon, qora qiya sarlavhalar, bitta qizil-to'q sariq belgi rangi.
Muqobil variantlar (A «Mono», B «Volt») — `directions/` papkasida.

## Raqamlarni o'zgartirish

Barcha raqamlar (kg, sm) bitta faylda: `data/specs.json`.
Masalan, sariq rezinka nagruzkasini o'zgartirish uchun `"res_yellow_kg": "6,8"` qiymatini almashtiring.
Umumiy nagruzka (`res_total_kg`) bo'sh (`null`) qoldirilsa, 5 ta qiymat yig'indisi o'zi hisoblanadi.

Keyin rasmlarni qayta chiqarish:

```
npm i playwright && npx playwright install chromium   # bir marta
node tools/render.mjs slides output                     # 8 ta PNG qayta yaratiladi
python3 tools/contact.py output                        # umumiy ko'rinish (_contact.jpg, _thumbs.jpg)
```

Matnlar har bir slayd faylida: `slides/NN_*.html`. Dizayn tizimi: `slides/base.css`. To'liq brif: `BRIEF.md`.

## Faktlar manbasi

Faqat yetkazib beruvchining asl rasmlaridan: 11 ta narsa, o'lchamlar, rang tartibi.
Nagruzka «15 to 35 LB» dan 5 lb qadam bilan hisoblangan (15/20/25/30/35 lb → 6,8 / 9,1 / 11,3 / 13,6 / 15,9 kg, jami 56,7 kg).
