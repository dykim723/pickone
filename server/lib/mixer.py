'''
Created on 2016. 12. 13.

@author: dykim
'''
import sys
import queue
from pydub import AudioSegment

class Mixer:
        
    def __init__(self):
        self.fileList = queue.Queue(100)
                
    def run(self):

        if self.fileList.qsize() >= 2:
            baseSoundPath = self.fileList.get()
            baseSound = AudioSegment.from_mp3(baseSoundPath)
            
            while self.fileList.qsize() > 0:
                soundPath = self.fileList.get()
                print('sound: ' + soundPath);
                sound = AudioSegment.from_mp3(soundPath)
            
                baseSound = baseSound.overlay(sound)
        
            path = baseSound.export("lib/test_file/combined.mp3", format='mp3')
            print("Completed: " + str(path))
        
    def add(self, file):        
        self.fileList.put(file)
        print("added count: " + str(self.fileList.qsize()))
        

if __name__ == '__main__':
    print('\n'.join(sys.argv));

    mixer = Mixer()

