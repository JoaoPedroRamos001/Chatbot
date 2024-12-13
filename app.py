from flask import Flask, request, jsonify  
from flask_cors import CORS  
import google.generativeai as genai  

app = Flask(__name__)  #cria uma instância da aplicação flask
CORS(app)  #receba requisições de diferentes origens

#a chave da api do google gemini
GOOGLE_GEMINI_API_KEY = "AIzaSyCMcAh6-zCqit1HsXTfEoE2EgFUaEJJ7-U"
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)  #onfigura a biblioteca genai com a chave da api
chat = genai.GenerativeModel("gemini-1.5-flash").start_chat(history=[])  #inicia um modelo de chat com histórico vazio

#rota para receber mensagens do usuario e processar a resposta do bot
@app.route('/chat', methods=['POST']) 
def chat_with_bot(): 
    data = request.json  
    user_message = data.get("message", "") 
    if not user_message: 
        return jsonify({"error": "mensagem vazia"}), 400  
    
    response = chat.send_message(user_message) 
    return jsonify({"reply": response.text}) 

if __name__ == '__main__':  #verifica se o script está sendo executado diretamente
    app.run(debug=True)  #inicia o servidor flask em modo de depuração