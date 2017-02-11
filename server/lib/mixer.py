'''
Created on 2016. 12. 13.

@author: dykim
'''
import sys
import queue
from pydub import AudioSegment
import os

class Mixer:
        
    def __init__(self):
        self.fileList = queue.Queue(100)
                
    def run(self):

        if self.fileList.qsize() >= 2:
            baseSoundPath = 'd:\\Workspace\\audio_mixer\\server\\upload\\TestEmail@gmail.com\\' + self.fileList.get()
            print(os.path.dirname(os.path.realpath(__file__)));

            baseSound = AudioSegment.from_ogg(baseSoundPath)

            while self.fileList.qsize() > 0:
                soundPath =  'd:\\Workspace\\audio_mixer\\server\\upload\\TestEmail@gmail.com\\' + self.fileList.get()
                print('sound: ' + soundPath);
                sound = AudioSegment.from_ogg(soundPath)

                baseSound = baseSound.overlay(sound)

            path = baseSound.export("lib/test_file/combined.ogg", format='ogg')
            print("Completed: " + str(path))

    def add(self, file):        
        self.fileList.put(file)
        print("added count: " + str(self.fileList.qsize()))
        

if __name__ == '__main__':

    fileCount = sys.argv[1];


    mixer = Mixer()

    for i in sys.argv[1:]:
        mixer.add(i);


    mixer.run();

