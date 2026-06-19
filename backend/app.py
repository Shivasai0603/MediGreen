from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import io
from PIL import Image
from plants_database import get_plant_details
from groq import Groq

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

# ── Load YOLO model ────────────────────────────────────────────────────────────
model = YOLO('model/best.pt')

# ── Groq client ────────────────────────────────────────────────────────────────
import os
from groq import Groq

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# ── Alias map: frontend display names → your plants_database.py keys ──────────
PLANT_ALIASES = {
    "aloe vera":                                        "Aloe vera",
    "arive-dantu":                                      "Arive-Dantu",
    "basale":                                           "Basale",
    "betel leaf":                                       "Betel leaf",
    "curry leaf":                                       "Curry leaf",
    "drumstick":                                        "Drumstick",
    "drumstick leaf":                                   "Drumstick leaf",
    "guava leaf":                                       "Guava leaf",
    "hibiscus":                                         "Hibiscus Rosa-sinensis",
    "hibiscus rosa-sinensis":                           "Hibiscus Rosa-sinensis",
    "indian mustard":                                   "Indian Mustard",
    "jackfruit leaf":                                   "Jackfruit leaf",
    "jamaica cherry":                                   "Jamaica Cherry-Gasagase",
    "jamaica cherry-gasagase":                          "Jamaica Cherry-Gasagase",
    "jamaica cherry leaf":                              "Jamaica Cherry-Gasagase leaf",
    "jamaica cherry-gasagase leaf":                     "Jamaica Cherry-Gasagase leaf",
    "jamun leaf":                                       "Jamun leaf",
    "jasmine leaf":                                     "Jasmine leaf",
    "lemon leaf":                                       "Lemon leaf",
    "mexican mint":                                     "Mexican Mint",
    "mint":                                             "Mint",
    "oleander":                                         "Oleander",
    "peepal leaf":                                      "Peepal leaf",
    "amla":                                             "Phyllanthus emblica-Amla",
    "phyllanthus emblica-amla":                         "Phyllanthus emblica-Amla",
    "pomegranate":                                      "Pomegranate",
    "pomegranate leaf":                                 "Pomegranate leaf",
    "rasna leaf":                                       "Rasna leaf",
    "sandalwood leaf":                                  "Sandalwood leaf",
    "syzygium cumini (jamun)":                          "Syzygium Cumini -Jamun",
    "syzygium cumini -jamun":                           "Syzygium Cumini -Jamun",
    "rose apple leaf":                                  "Syzygium Jambos -Rose Apple",
    "syzygium jambos -rose apple":                      "Syzygium Jambos -Rose Apple",
    "crape jasmine":                                    "Tabernaemontana Divaricata- Crape Jasmine",
    "tabernaemontana divaricata- crape jasmine":        "Tabernaemontana Divaricata- Crape Jasmine",
    "giloy (tinospora)":                                "Tinospora cordifolia",
    "tinospora cordifolia":                             "Tinospora cordifolia",
    "fenugreek":                                        "Trigonella Fenugreek-Fenugreek",
    "trigonella fenugreek-fenugreek":                   "Trigonella Fenugreek-Fenugreek",
    "tulsi":                                            "Tulsi",
    "turmeric leaf":                                    "Turmeric leaf",
    "ginger":                                           "Zingiber officinale - Ginger",
    "zingiber officinale - ginger":                     "Zingiber officinale - Ginger",
    "karanda":                                          "karanda",
    "neem leaf":                                        "neem leaf",
    "roxburgh fig leaf":                                "roxburgh leaf",
    "roxburgh leaf":                                    "roxburgh leaf",
    "parijata (night jasmine)":                         "tristis -Parijata-",
    "tristis -parijata-":                               "tristis -Parijata-",
    "malabar spinach":                                  "Basale",
}

# ── Interactions database ──────────────────────────────────────────────────────
INTERACTIONS_DB = [
    {
        "plants": ["Tulsi", "Zingiber officinale - Ginger"],
        "level": "caution",
        "msg": "Both have mild blood-thinning properties. Combined use may increase anticoagulant effects. Avoid before surgery or if on blood-thinning medication."
    },
    {
        "plants": ["neem leaf", "Guava leaf"],
        "level": "caution",
        "msg": "Both significantly lower blood sugar. Combined use risks hypoglycemia in diabetic patients already on medication — monitor glucose levels carefully."
    },
    {
        "plants": ["Tinospora cordifolia", "neem leaf"],
        "level": "info",
        "msg": "Classic Ayurvedic immunity combination. Generally safe for most people. Avoid if you have an autoimmune condition."
    },
    {
        "plants": ["Trigonella Fenugreek-Fenugreek", "Jamun leaf"],
        "level": "warning",
        "msg": "Both are potent blood sugar reducers. Combining without medical supervision may dangerously lower glucose levels."
    },
    {
        "plants": ["Trigonella Fenugreek-Fenugreek", "Syzygium Cumini -Jamun"],
        "level": "warning",
        "msg": "Both strongly lower blood sugar. This combination requires careful glucose monitoring and medical supervision."
    },
    {
        "plants": ["Hibiscus Rosa-sinensis", "Pomegranate"],
        "level": "caution",
        "msg": "Both lower blood pressure. Combined use may cause excessive hypotension in patients already on BP medication."
    },
    {
        "plants": ["Tulsi", "Mexican Mint"],
        "level": "info",
        "msg": "Both are bronchodilators and respiratory aids. Safe and effective combination for cold and cough. No known adverse interactions."
    },
    {
        "plants": ["Aloe vera", "Trigonella Fenugreek-Fenugreek"],
        "level": "caution",
        "msg": "Both have laxative properties. Combining may cause excessive bowel movement and dehydration — use in moderation."
    },
    {
        "plants": ["Zingiber officinale - Ginger", "Indian Mustard"],
        "level": "warning",
        "msg": "Both generate internal heat. Combined use may cause gastric irritation in people with ulcers or acid reflux."
    },
    {
        "plants": ["Phyllanthus emblica-Amla", "Turmeric leaf"],
        "level": "info",
        "msg": "Excellent combination — Vitamin C in Amla enhances curcumin absorption from Turmeric. Highly recommended together."
    },
    {
        "plants": ["Tulsi", "Lemon leaf"],
        "level": "info",
        "msg": "Safe and calming combination. Good for stress relief and respiratory health together. No known adverse interactions."
    },
    {
        "plants": ["Trigonella Fenugreek-Fenugreek", "Guava leaf"],
        "level": "warning",
        "msg": "Both significantly lower blood sugar. Can lead to dangerous hypoglycemia — do not combine without medical supervision."
    },
    {
        "plants": ["Tinospora cordifolia", "Turmeric leaf"],
        "level": "info",
        "msg": "Powerful anti-inflammatory combination widely used in Ayurveda. Safe for general use."
    },
    {
        "plants": ["neem leaf", "Tulsi"],
        "level": "info",
        "msg": "Classic Ayurvedic immunity and detox combination. Generally safe. Avoid large doses during pregnancy."
    },
    {
        "plants": ["Jamun leaf", "Syzygium Cumini -Jamun"],
        "level": "caution",
        "msg": "Both are the same species (Syzygium cumini). Using both intensifies blood sugar lowering — monitor glucose carefully."
    },
    {
        "plants": ["Peepal leaf", "Tulsi"],
        "level": "info",
        "msg": "Traditional combination for respiratory health and asthma. Safe for general use."
    },
    {
        "plants": ["Phyllanthus emblica-Amla", "neem leaf"],
        "level": "info",
        "msg": "Powerful detox and immunity combination. Safe for most people. Avoid during pregnancy in large doses."
    },
    {
        "plants": ["Mint", "Zingiber officinale - Ginger"],
        "level": "info",
        "msg": "Excellent digestive combination. Widely used in herbal teas. Safe for general use with no known adverse interactions."
    },
    {
        "plants": ["Tulsi", "Tinospora cordifolia"],
        "level": "info",
        "msg": "Powerful immunity-boosting combination. Safe for most people. Avoid if you have autoimmune conditions."
    },
    {
        "plants": ["Curry leaf", "Trigonella Fenugreek-Fenugreek"],
        "level": "caution",
        "msg": "Both have anti-diabetic properties. Combined use may lower blood sugar more than expected — monitor levels if diabetic."
    },
]


# ══════════════════════════════════════════════════════════════════════════════
# ROUTE: /predict
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    img  = Image.open(io.BytesIO(file.read()))

    results = model(img)

    if len(results[0].boxes) == 0:
        return jsonify({'error': 'No medicinal plant detected.'}), 404

    label = results[0].names[int(results[0].boxes[0].cls)]

    # Build top-3 list
    boxes = results[0].boxes
    top3  = []
    if len(boxes) > 0:
        paired = sorted(
            zip(boxes.conf.tolist(), boxes.cls.tolist()), reverse=True
        )[:3]
        for conf, cls in paired:
            top3.append({
                "name":       results[0].names[int(cls)],
                "confidence": round(conf * 100, 1)
            })

    data = get_plant_details(label)
    data["top3"]       = top3
    data["confidence"] = top3[0]["confidence"] if top3 else 95.0

    return jsonify(data)


# ══════════════════════════════════════════════════════════════════════════════
# ROUTE: /chat
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    body = request.get_json(force=True, silent=True)
    if not body:
        return jsonify({'error': 'No JSON body received'}), 400

    plant_name = body.get('plant_name', '')
    plant_sci  = body.get('scientific_name', '')
    plant_uses = body.get('uses', '')
    plant_prep = body.get('preparation', '')
    message    = body.get('message', '')
    messages   = body.get('messages', [])

    if not message:
        return jsonify({'error': 'No message provided'}), 400

    system_prompt = f"""You are MediGreen AI, an expert Ayurvedic botanist assistant embedded in a medicinal plant identification app.

The user has just identified this plant:
- Common Name: {plant_name}
- Scientific Name: {plant_sci}
- Medicinal Uses: {plant_uses}
- Preparation: {plant_prep}

Answer questions about this plant concisely and helpfully. Keep responses under 100 words.
Always remind users to consult a qualified doctor or Ayurvedic practitioner for serious conditions.
Never recommend replacing prescribed medication with herbal remedies."""

    groq_messages = [{"role": "system", "content": system_prompt}]
    for msg in messages[-6:]:
        role = msg.get("role", "user")
        if role not in ("user", "assistant"):
            role = "user"
        groq_messages.append({"role": role, "content": msg.get("content", "")})
    groq_messages.append({"role": "user", "content": message})

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=groq_messages,
            max_tokens=200,
            temperature=0.7,
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# ROUTE: /interactions
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/interactions', methods=['POST', 'OPTIONS'])
def interactions():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    body = request.get_json(force=True, silent=True)
    if not body:
        return jsonify({'error': 'No JSON body received'}), 400

    selected   = body.get('plants', [])
    normalized = [PLANT_ALIASES.get(n.lower().strip(), n) for n in selected]

    found = []
    for i in range(len(normalized)):
        for j in range(i + 1, len(normalized)):
            a, b = normalized[i], normalized[j]
            for interaction in INTERACTIONS_DB:
                p_lower = [p.lower() for p in interaction["plants"]]
                if a.lower() in p_lower and b.lower() in p_lower:
                    if interaction not in found:
                        found.append(interaction)
                    break

    if not found:
        return jsonify([{
            "level": "safe",
            "msg":   "No known interactions found between the selected plants. This does not mean they are completely safe to combine — always consult an Ayurvedic practitioner."
        }])

    return jsonify(found)


# ══════════════════════════════════════════════════════════════════════════════
# ROUTE: /test  — quick health check, open in browser to confirm Flask works
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        "status":  "ok",
        "message": "MediGreen Flask backend is running correctly",
        "routes":  ["/predict", "/chat", "/interactions", "/test"]
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)