
/*---------------------------------- Librarys --------------------------------------------------------*/

const speech = require('@google-cloud/speech');
const {Storage} = require('@google-cloud/storage');

const gcs = new Storage({
  projectId: projectId,
  keyFilename: keyFilename,
});
const client = new speech.SpeechClient({
   projectId: projectId,
   keyFilename: keyFilename,
   _use_grpc: false,
});

var nome = nome_arquivo
/*---------------------------------- Audio Transcription Config --------------------------------------------------------*/

const recognitionMetadata = {
    microphoneDistance: 'NEARFIELD',
};
const languageCode = 'pt-BR';
const audioChannelCount = 1;
const enableSeparateRecognitionPerChannel = false;
const maxAlternatives = 1;
const useEnhanced = true;
const metadata = recognitionMetadata;
const recordingDeviceType = 'PHONE_LINE';
const interactioType = 'PHONE_CALL'
const industryNaicsCodeOfAudio = 561422;
var sampleRate=0;
var Channels=0;

/*-------------------------------------- Transcription ----------------------------------------------------*/

function write_file(conteudo, nome) {
	var nome_extensao = nome + '.txt';
	var stream = gcs.bucket(destFilename).file(nome_extensao).createWriteStream();
	stream.on('error', function(error){
		console.log(error);
	});
	console.log("Escrevendo o arquivo...");
	stream.write(conteudo);
	stream.end();
};


/*---------------------------------- Config Transcription --------------------------------------------------------*/

const audio = {
	uri: gcsUri,
};
				
const config = {
	encoding: encoding,
	sampleRateHertz:sampleRate,
	languageCode: languageCode,
	audioChannelCount: 1,
	enableSeparateRecognitionPerChannel: enableSeparateRecognitionPerChannel,
	maxAlternatives: maxAlternatives,
	useEnhanced: useEnhanced,
	metadata: metadata,
	industryNaicsCodeOfAudio: industryNaicsCodeOfAudio,
	recordingDeviceType: recordingDeviceType,
	interactioType: interactioType,
};

const request = {
	config: config,
	audio: audio,
};
        
/*------------------------------------- Audio Transcription -----------------------------------------------------*/

function speech_to_text(request, nome) {

        client.longRunningRecognize(request)
                .then((data) => {
                const operation = data[0];
        
                // The following Promise represents the final result of the job
                return operation.promise();
                })
                .then((data) => {
		const results = _.get(data[0], 'resultados', []);
                var transcription = results.map(result => result.alternatives[0].transcript).join('\n');
                console.log(`Transcrição: ${transcription}`);
                var conteudo = transcription
                write_file(conteudo);
                    
                })
            .catch(err => {
            console.error('ERROR:', err);
            
            });

}
