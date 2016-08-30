(function(){
	'use strict';

	angular.module('app', [])
	.controller('audioController', function($scope){
		var vm = this;
		vm.audioLoaded = false;
		vm.audio = {};
		vm.volumeIncrement = 0.05;
		vm.volumeChange = false;
		vm.audioSettings = {
			morning : ['pads'],
			lateMorning: ['pads', 'mallets'],
			noon: ['pads', 'mallets', 'guitarsRhythm'],
			afternoon: ['pads', 'mallets', 'guitarsRhythm', 'perc'],
			evening: ['pads', 'mallets', 'guitarsRhythm', 'perc','bigDrums', 'chilledDrums'],
			night: ['pads', 'mallets', 'guitarsRhythm', 'perc','bigDrums', 'chilledDrums','guitarsLead', 'Synths']
		}

		var instruments = ['pads', 'mallets', 'guitarsRhythm', 'perc','bigDrums', 'chilledDrums','guitarsLead', 'Synths'];

		vm.currentInstruments = instruments;

		angular.element(document).ready(function(){
			for (var i in instruments){
				vm.audio[instruments[i]] = {};
				vm.audio[instruments[i]].sound = document.createElement('audio');
				vm.audio[instruments[i]].sound.src = 'sounds/' + instruments[i] + '.mp3';
				vm.audio[instruments[i]].sound.loop = true;
					//vm.audio[instruments[i]].sound.volume = 0;
					vm.audio[instruments[i]].sound.load();
				}

				checkIfLoaded();


			});

		vm.changeTo = function(timeOfDay){
			var newSounds = vm.audioSettings[timeOfDay];
			vm.volumeChange = true;
			for (var i in vm.audio){
				vm.audio[i].play = false;
			}
			for (var i in newSounds){
				vm.audio[newSounds[i]].play = true;
			}

			vm.currentInstruments = newSounds;

		}

		function manageVolume(){
			if (vm.volumeChange){
				var total = 0,
					correct = 0,
					instrument;
				for (var i in instruments){
					total +=1;
					instrument = vm.audio[instruments[i]];
					if(instrument.play){
						if(instrument.sound.volume !== 1){
							try {
								instrument.sound.volume = instrument.sound.volume + vm.volumeIncrement <= 1 ? instrument.sound.volume + vm.volumeIncrement : 1;	
							} catch (e){
								console.log(e.message);
							}
							
						} else {
							correct +=1;
						}
					} else {
						if(instrument.sound.volume !== 0){
							try {
								instrument.sound.volume = instrument.sound.volume - vm.volumeIncrement >= 0 ? instrument.sound.volume - vm.volumeIncrement : 0;
							} catch (e){
								console.log(e.message);
							}
						} else {
							correct +=1;
						}
					}
				}
				if (correct === total){
					vm.volumeChange = false;
				}
			}

			requestAnimationFrame(manageVolume);
		}

		function playAll(){
			for (var i in vm.audio){
				vm.audio[i].sound.play();	
			}
			manageVolume();
		}

		function checkIfLoaded(){
			var readyCount = 0,
			total = 0;

			for (var i in vm.audio){
				if (vm.audio[i].readyState === 4){
					readyCount += 1;
				}
			}

			if (readyCount === total){
				vm.audioLoaded = true;
				playAll();
				$scope.$digest();
			} else {
				setTimeout(checkIfLoaded, 100);
			}
		}

	})
				})();