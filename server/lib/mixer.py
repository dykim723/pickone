'''
Created on 2016. 12. 13.

@author: dykim
'''
import sys
import queue
from pydub import AudioSegment
import os

class Mixer:

    def __init__(self, user):
        self.fileList = queue.Queue(100)
        self.userID = user + '\\'
        self.uploadPath = '\\upload\\'
        self.basePath = os.getcwd() + self.uploadPath + self.userID
        self.exportPath = os.getcwd() + '\\public\\files\\' + self.userID

    def run(self):

        if self.fileList.qsize() >= 2:
            baseSoundPath = self.basePath + self.fileList.get()
            #print(baseSoundPath)

            baseSound = AudioSegment.from_ogg(baseSoundPath)

            while self.fileList.qsize() > 0:
                soundPath =  self.basePath + self.fileList.get()
                print('sound: ' + soundPath)
                sound = AudioSegment.from_ogg(soundPath)

                baseSound = baseSound.overlay(sound)

            if not os.path.exists(self.exportPath):
                os.makedirs(self.exportPath)

            path = baseSound.export(self.exportPath + "combined.ogg", format='ogg')
            print(self.exportPath + "combined.ogg")

    def add(self, file):
        self.fileList.put(file)
        #print("added count: " + str(self.fileList.qsize()))


if __name__ == '__main__':

    mixer = Mixer(sys.argv[1])

    for i in sys.argv[2:]:
        mixer.add(i)


    mixer.run()