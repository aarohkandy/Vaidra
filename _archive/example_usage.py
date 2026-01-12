from transformers import AutoModel
import numpy as np
import soundfile as sf

def main():
    """Simple example using IndicF5 model for text-to-speech"""
    
    print("Loading IndicF5 model...")
    # Load IndicF5 from Hugging Face
    repo_id = "ai4bharat/IndicF5"
    model = AutoModel.from_pretrained(repo_id, trust_remote_code=True)
    print("Model loaded successfully!")
    
    # Example text in Hindi
    text = "नमस्ते! संगीत की तरह जीवन भी खूबसूरत होता है, बस इसे सही ताल में जीना आना चाहिए।"
    
    print(f"Generating speech for: {text}")
    
    # Generate speech
    audio = model(
        text,
        ref_audio_path="prompts/PAN_F_HAPPY_00001.wav",  # Optional reference audio
        ref_text="ਭਹੰਪੀ ਵਿੱਚ ਸਮਾਰਕਾਂ ਦੇ ਭਵਨ ਨਿਰਮਾਣ ਕਲਾ ਦੇ ਵੇਰਵੇ ਗੁੰਝਲਦਾਰ ਅਤੇ ਹੈਰਾਨ ਕਰਨ ਵਾਲੇ ਹਨ, ਜੋ ਮੈਨੂੰ ਖੁਸ਼ ਕਰਦੇ  ਹਨ।"  # Optional reference text
    )
    
    # Normalize and save output
    if audio.dtype == np.int16:
        audio = audio.astype(np.float32) / 32768.0
    
    output_file = "namaste.wav"
    sf.write(output_file, np.array(audio, dtype=np.float32), samplerate=24000)
    print(f"Audio saved successfully to: {output_file}")

if __name__ == "__main__":
    main() 