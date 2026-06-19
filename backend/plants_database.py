def get_plant_details(label):
    plants = {
        "Aloe vera": {
            "sci": "Aloe barbadensis miller",
            "use": "A succulent species used for centuries in traditional medicine. It contains 75 active constituents: vitamins, enzymes, minerals, sugars, lignin, saponins, salicylic acids and amino acids. It is the gold standard for treating first and second-degree burns and skin hydration.",
            "prep": "• Topical: Slice a mature leaf vertically, scoop out the clear gel, and apply directly to burns or dry skin. • Juice: Blend 2 tbsp of fresh gel with 1 cup of water or citrus juice (ensure the yellow 'latex' layer is removed)."
        },
        "Arive-Dantu": {
            "sci": "Amaranthus viridis",
            "use": "Commonly known as slender amaranth, it is an iron powerhouse. It is used to treat anemia, improve bone density, and acts as a natural laxative. It contains high amounts of Vitamin A and C.",
            "prep": "• Culinary: The leaves and stems are typically boiled and seasoned in stir-fries (Palya) or added to Sambar. • Decoction: Boil leaves in water to create a wash for skin irritations."
        },
        "Basale": {
            "sci": "Basella alba",
            "use": "Also known as Malabar Spinach. It is a cooling agent for the body, excellent for treating mouth ulcers, constipation, and stomach inflammation. It is rich in Vitamin A, Vitamin C, Iron, and Calcium.",
            "prep": "• For Ulcers: Chew 2-3 raw leaves to soothe mouth sores. • Culinary: Used in traditional gravies (Basale Saaru). The juice of the berries is also used as a natural food coloring."
        },
        "Betel leaf": {
            "sci": "Piper betle",
            "use": "A powerful digestive stimulant and breath freshener. It has analgesic properties and is used to relieve oral pain, cough, and chest congestion. It acts as an effective carminative.",
            "prep": "• Digestive: Chew a fresh leaf with a bit of lime and areca nut after meals. • Cough: Apply a warm betel leaf coated with oil to the chest to relieve congestion in children."
        },
        "Curry leaf": {
            "sci": "Murraya koenigii",
            "use": "Packed with carbazole alkaloids which have antioxidant, anti-diabetic, and anti-inflammatory properties. It is famous for improving eyesight, preventing premature greying of hair, and aiding weight loss.",
            "prep": "• Hair: Boil leaves in coconut oil until they turn black; use this oil for scalp health. • Culinary: Include fresh leaves in every tempering (Tadka) or grind into a chutney for maximum nutrient absorption."
        },
        "Drumstick": {
            "sci": "Moringa oleifera (Fruit)",
            "use": "The pods (drumsticks) are rich in Vitamin C and fiber. They are known to improve joint health, boost libido, and act as a natural blood purifier.",
            "prep": "• Culinary: Boil the pods in soups or stews (Sambar). The pulp inside is the most nutrient-dense part."
        },
        "Drumstick leaf": {
            "sci": "Moringa oleifera (Leaf)",
            "use": "One of the most nutrient-dense greens on Earth. Known as the 'Miracle Tree,' it treats over 300 conditions including inflammation, high blood sugar, and anemia.",
            "prep": "• Powder: Dry leaves in the shade and grind into powder; add 1 tsp to smoothies. • Culinary: Sauté with garlic and coconut for a healthy side dish."
        },
        "Guava leaf": {
            "sci": "Psidium guajava",
            "use": "Extremely effective for managing blood sugar levels and treating digestive distress like diarrhea. It contains high levels of tannins and antioxidants.",
            "prep": "• Tea: Boil 3-5 young leaves in 2 cups of water for 10 minutes. Drink to settle the stomach or lower blood sugar."
        },
        "Hibiscus Rosa-sinensis": {
            "sci": "Hibiscus rosa-sinensis",
            "use": "Primarily used for hair health and regulating blood pressure. It acts as a natural shampoo (mucilage) and prevents split ends and greying.",
            "prep": "• Mask: Grind leaves and flowers into a slippery paste; apply to hair for 30 mins. • Tea: Steep dried petals in hot water for a heart-healthy, tart drink."
        },
        "Indian Mustard": {
            "sci": "Brassica juncea",
            "use": "The leaves and oil are used to relieve muscle pain and respiratory congestion. It contains allyl isothiocyanate, which is a potent antimicrobial agent.",
            "prep": "• Massage: Warm the seed oil with garlic for joint pain. • Culinary: Use young leaves in 'Sarson da Saag' for a nutrient-heavy winter meal."
        },
        "Jackfruit leaf": {
            "sci": "Artocarpus heterophyllus",
            "use": "Known for anti-diabetic and antioxidant properties. In folk medicine, the leaves are used to treat skin diseases and speed up wound healing.",
            "prep": "• Wash: Boil leaves in water and use the liquid as an antiseptic wash for skin sores."
        },
        "Jamaica Cherry-Gasagase": {
            "sci": "Muntingia calabura",
            "use": "The fruit and leaves are used to relieve headaches, reduce gout pain, and lower blood pressure. It has strong anti-inflammatory properties.",
            "prep": "• Tea: Boil leaves to create a drink that helps manage high blood pressure and spasms."
        },
        "Jamaica Cherry-Gasagase leaf": {
            "sci": "Muntingia calabura (Leaf)",
            "use": "Specifically used for its antibacterial and anti-spasmodic properties. It is often used in rural medicine to treat indigestion.",
            "prep": "• Infusion: Steep leaves in hot water for 10 minutes to help with stomach cramps."
        },
        "Jamun leaf": {
            "sci": "Syzygium cumini",
            "use": "Crucial for oral health and diabetes management. It helps strengthen gums and treats bleeding gums (gingivitis).",
            "prep": "• Oral: Chew fresh leaves or use a decoction of leaves as a mouthwash."
        },
        "Jasmine leaf": {
            "sci": "Jasminum",
            "use": "Used to treat skin diseases, ulcers, and wounds. It has a cooling effect and is often used in aromatherapy to reduce anxiety.",
            "prep": "• Paste: Grind leaves and apply to wounds or skin ulcers to speed up healing."
        },
        "Lemon leaf": {
            "sci": "Citrus limon",
            "use": "Used for its calming properties. It helps treat insomnia, nervousness, and anxiety. It also has mild antispasmodic effects.",
            "prep": "• Aromatherapy: Crush leaves and inhale the scent. • Tea: Steep leaves in boiling water for a sedative drink before bed."
        },
        "Mexican Mint": {
            "sci": "Coleus amboinicus",
            "use": "Known as 'Ajwain leaf' in India. It is a powerful bronchodilator. It provides instant relief for cold, cough, sore throat, and nasal congestion.",
            "prep": "• Cough: Extract 1 tsp of juice from crushed leaves, mix with honey. • Culinary: Dip in gram flour and fry (Bajji) to make it palatable for children."
        },
        "Mint": {
            "sci": "Mentha",
            "use": "Aids digestion and treats Irritable Bowel Syndrome (IBS). It has a cooling effect and is excellent for treating nausea and morning sickness.",
            "prep": "• Digestive: Add fresh leaves to hot tea or chew raw after a heavy meal."
        },
        "Oleander": {
            "sci": "Nerium oleander",
            "use": "CAUTION: Highly toxic if ingested. In controlled traditional medicine, it is used externally for skin conditions like leprosy and ringworm.",
            "prep": "• WARNING: Do not consume. External applications should only be done under expert supervision."
        },
        "Peepal leaf": {
            "sci": "Ficus religiosa",
            "use": "Sacred Fig. Used to treat asthma, jaundice, and digestive disorders. It has a high concentration of tannins.",
            "prep": "• Juice: 2 tsp of leaf juice mixed with sugar can help with digestive distress."
        },
        "Phyllanthus emblica-Amla": {
            "sci": "Phyllanthus emblica",
            "use": "One of the richest sources of Vitamin C. It is a powerful rejuvenator (Rasayana) that boosts immunity, improves skin, and prevents hair fall.",
            "prep": "• Internal: Consume one fresh fruit daily or take 1 tsp of dried powder with warm water."
        },
        "Pomegranate": {
            "sci": "Punica granatum",
            "use": "The seeds and juice are heart-healthy, improving blood flow and treating anemia. It is packed with punicalagins and punicic acid.",
            "prep": "• Internal: Drink 200ml of fresh juice daily to boost hemoglobin levels."
        },
        "Pomegranate leaf": {
            "sci": "Punica granatum (Leaf)",
            "use": "Used to treat insomnia and digestive issues. It has mild sedative properties that help with sleep quality.",
            "prep": "• Sleep: Boil 5-10 leaves in water to create a calming tea to be taken at night."
        },
        "Rasna leaf": {
            "sci": "Pluchea lanceolata",
            "use": "A major Ayurvedic herb for joint pain and respiratory disorders. It is the best herb for Vata-related issues like arthritis and sciatica.",
            "prep": "• Decoction: Use the leaves to make a 'Kashayam' (concentrated tea) for joint relief."
        },
        "Sandalwood leaf": {
            "sci": "Santalum album",
            "use": "While the wood is more famous, the leaves have antimicrobial and skin-cooling properties used in traditional pastes.",
            "prep": "• Topical: Grind leaves into a paste with rose water for minor skin rashes."
        },
        "Syzygium Cumini -Jamun": {
            "sci": "Syzygium cumini",
            "use": "Specifically identified for diabetes management. The leaves help lower blood sugar levels and purify the blood.",
            "prep": "• Internal: Boil leaves in water until the volume reduces by half; drink on an empty stomach."
        },
        "Syzygium Jambos -Rose Apple": {
            "sci": "Syzygium jambos",
            "use": "The leaves have strong brain and liver tonic properties. It is also used in traditional medicine to treat fevers.",
            "prep": "• Decoction: Boil leaves and use the cooled liquid to help lower body temperature during fever."
        },
        "Tabernaemontana Divaricata- Crape Jasmine": {
            "sci": "Tabernaemontana divaricata",
            "use": "The milky sap is used to treat eye sores and skin inflammation. The roots are often used for toothaches.",
            "prep": "• Topical: The flower juice is used in drops for eye irritation (only under guidance)."
        },
        "Tinospora cordifolia": {
            "sci": "Tinospora cordifolia",
            "use": "Commonly known as Giloy. It is an immunity powerhouse used to treat chronic fevers, dengue, and hay fever. It is anti-diabetic and anti-toxic.",
            "prep": "• Kadha: Boil the stem and leaves in water with ginger and black pepper to boost immunity."
        },
        "Trigonella Fenugreek-Fenugreek": {
            "sci": "Trigonella foenum-graecum",
            "use": "Reduces cholesterol, controls blood sugar, and aids lactation in nursing mothers. It contains high amounts of fiber and minerals.",
            "prep": "• Internal: Soak 1 tsp of seeds overnight and consume with the water, or cook fresh leaves (Methi) in meals."
        },
        "Tulsi": {
            "sci": "Ocimum sanctum",
            "use": "The 'Queen of Herbs.' It is an adaptogen that helps the body cope with stress. It is anti-viral and excellent for all respiratory conditions.",
            "prep": "• Daily: Chew 3-5 raw leaves on an empty stomach. • Tea: Brew leaves with ginger and honey for cold relief."
        },
        "Turmeric leaf": {
            "sci": "Curcuma longa",
            "use": "Contains curcumin which is highly anti-inflammatory and antiseptic. The leaves are used to treat skin infections and respiratory issues.",
            "prep": "• Culinary: Wrap food in turmeric leaves for steaming (Patholi) to infuse the medicinal benefits into the food."
        },
        "Zingiber officinale - Ginger": {
            "sci": "Zingiber officinale",
            "use": "Excellent for digestion, morning sickness, and muscle pain. It has powerful anti-inflammatory and antioxidant effects.",
            "prep": "• Tea: Grate 1 inch of ginger into boiling water. Drink for instant nausea or cold relief."
        },
        "karanda": {
            "sci": "Carissa carandas",
            "use": "Used to treat acidity, indigestion, and skin sores. It is very high in Vitamin C and iron.",
            "prep": "• Culinary: The fruit is eaten raw or pickled. The leaves are boiled for treating fevers."
        },
        "neem leaf": {
            "sci": "Azadirachta indica",
            "use": "World's best natural antiseptic. Purifies blood, treats skin diseases like ringworm and acne, and boosts immunity.",
            "prep": "• Skin: Apply a paste of leaves to infections. • Bath: Boil leaves in bathwater to treat body acne and skin itchiness."
        },
        "roxburgh leaf": {
            "sci": "Ficus roxburghii",
            "use": "Elephant Ear Fig. The leaves are used to treat diarrhea, dysentery, and are known to have wound-healing properties.",
            "prep": "• Juice: The latex and leaf juice are applied to wounds to speed up healing."
        },
        "tristis -Parijata-": {
            "sci": "Nyctanthes arbor-tristis",
            "use": "Used primarily for sciatica, arthritis, and malaria. It is a very effective anti-inflammatory agent.",
            "prep": "• Joint Pain: Boil 5 leaves in water, strain and drink once daily. It is very bitter but effective."
        },
        "all": {
            "sci": "Mixed Medicinal Species",
            "use": "This represents a collection of medicinal flora used in traditional South Indian medicine.",
            "prep": "Consult specific plant profiles for preparation."
        }
    }

    # Fetch with fallback
    data = plants.get(label, {
        "sci": "Unknown Species",
        "use": "Standard medicinal plant profile.",
        "prep": "Consult an herbalist for specific preparation."
    })

    return {
        "name": label,
        "scientific_name": data["sci"],
        "uses": data["use"],
        "preparation": data["prep"]
    }