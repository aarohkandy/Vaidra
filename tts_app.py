from transformers import AutoModel
import numpy as np
import soundfile as sf
import os
import argparse

def load_model():
    """Load the IndicF5 model from Hugging Face"""
    print("Loading IndicF5 model...")
    repo_id = "ai4bharat/IndicF5"
    model = AutoModel.from_pretrained(repo_id, trust_remote_code=True)
    print("Model loaded successfully!")
    return model

def generate_speech(model, text, ref_audio_path=None, ref_text=None, output_path="output.wav"):
    """Generate speech using the IndicF5 model"""
    try:
        print(f"Generating speech for: {text[:50]}...")
        
        # Generate audio
        audio = model(
            text,
            ref_audio_path=ref_audio_path,
            ref_text=ref_text
        )
        
        # Normalize audio
        if audio.dtype == np.int16:
            audio = audio.astype(np.float32) / 32768.0
        
        # Save audio
        sf.write(output_path, np.array(audio, dtype=np.float32), samplerate=24000)
        print(f"Audio saved successfully to: {output_path}")
        return True
        
    except Exception as e:
        print(f"Error generating speech: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="IndicF5 Text-to-Speech Generator")
    parser.add_argument("--text", "-t", required=True, help="Text to convert to speech")
    parser.add_argument("--ref_audio", "-r", help="Reference audio file path")
    parser.add_argument("--ref_text", "-rt", help="Reference text for voice cloning")
    parser.add_argument("--output", "-o", default="output.wav", help="Output audio file path")
    
    args = parser.parse_args()
    
    # Load model
    model = load_model()
    
    # Generate speech
    success = generate_speech(
        model=model,
        text=args.text,
        ref_audio_path=args.ref_audio,
        ref_text=args.ref_text,
        output_path=args.output
    )
    
    if success:
        print("Speech generation completed successfully!")
    else:
        print("Speech generation failed!")

if __name__ == "__main__":
    # Example usage without command line arguments
    print("IndicF5 Text-to-Speech Generator")
    print("=" * 40)
    
    # Load model
    model = load_model()
    
    # Example texts in different languages
    examples = {
        "Hindi": "नमस्ते! संगीत की तरह जीवन भी खूबसूरत होता है, बस इसे सही ताल में जीना आना चाहिए।",
        "Tamil": "வணக்கம்! இசை போல வாழ்க்கையும் அழகாக இருக்கிறது, அதை சரியான தாளத்தில் வாழ்க்கை நடத்த வேண்டும்.",
        "Telugu": "నమస్కారం! సంగీతం లాగా జీవితం కూడా అందంగా ఉంటుంది, దాన్ని సరైన తాళంతో జీవించడం నేర్చుకోవాలి.",
        "Bengali": "নমস্কার! সঙ্গীতের মতো জীবনও সুন্দর হয়, শুধু এটিকে সঠিক তালে বাঁচতে জানতে হবে।",
        "Kannada": "ನಮಸ್ಕಾರ! ಸಂಗೀತದಂತೆ ಜೀವನವೂ ಸುಂದರವಾಗಿರುತ್ತದೆ, ಅದನ್ನು ಸರಿಯಾದ ತಾಳದಲ್ಲಿ ಬದುಕಲು ತಿಳಿಯಬೇಕು.",
        "Malayalam": "നമസ്കാരം! സംഗീതം പോലെ ജീവിതവും സുന്ദരമാണ്, അതിനെ ശരിയായ താളത്തിൽ ജീവിക്കാൻ പഠിക്കണം.",
        "English": "Hello! Life is beautiful like music, one just needs to learn to live it in the right rhythm."
    }
    
    # Generate speech for each example
    for language, text in examples.items():
        print(f"\nGenerating speech for {language}...")
        output_file = f"speech_{language.lower()}.wav"
        
        success = generate_speech(
            model=model,
            text=text,
            output_path=output_file
        )
        
        if success:
            print(f"✅ {language} audio saved as: {output_file}")
        else:
            print(f"❌ Failed to generate {language} audio")
    
    print("\n" + "=" * 40)
    print("All speech generation completed!")

# Interactive mode
def interactive_mode():
    """Run the TTS in interactive mode"""
    print("\nInteractive Mode")
    print("Enter 'quit' to exit")
    print("-" * 30)
    
    model = load_model()
    
    while True:
        text = input("\nEnter text to convert to speech: ").strip()
        
        if text.lower() == 'quit':
            break
            
        if not text:
            print("Please enter some text.")
            continue
        
        output_file = input("Enter output filename (default: output.wav): ").strip()
        if not output_file:
            output_file = "output.wav"
        
        success = generate_speech(model, text, output_path=output_file)
        
        if success:
            print(f"✅ Audio saved as: {output_file}")
        else:
            print("❌ Failed to generate audio")

# Uncomment the line below to run in interactive mode
# interactive_mode() 