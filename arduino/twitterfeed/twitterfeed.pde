
#include "Charliplexing.h"
#include "Myfont.h"

#include "Arduino.h"


  int leng=0; //provides the length of the char array
  char inChar; // Where to store the character read
  unsigned char inData[140]; 
  byte index = 0;
/* -----------------------------------------------------------------  */
/** MAIN program Setup
 */
void setup() {
  LedSign::Init();
  Serial.begin(9600);
}


unsigned char* serialReadStr() {
  while (Serial.available() > 0) {
      inChar = Serial.read(); // Read a character
      inData[index] = inChar; // Store it
      index++; // Increment where to write next
      inData[index] = '\0'; // Null terminate the string
    }
    
    return inData;
}

/* -----------------------------------------------------------------  */
/** MAIN program Loop
 */

void loop() {
   unsigned char* serialStr = serialReadStr();
   Serial.println(String((char *)serialStr));
  
  for(int i=0; ; i++){ //get the length of the text
    if(serialStr[i]==0){
      leng=i;
      break;
    }
    
  }
  Myfont::Banner(leng,serialStr);
  index = 0;
}
