#include <SPI.h>
#include <Ethernet.h>
#include <EthernetBonjour.h>
#include <EthernetUdp.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte ip[] = { 169, 254, 86, 154 };

EthernetUDP udp;

char message[1000];

char packetBuffer[UDP_TX_PACKET_MAX_SIZE];

void setup() {
  Ethernet.begin(mac, ip);
  udp.begin(8888);
  Serial.begin(9600);
  EthernetBonjour.begin("telemetry-arduino");
  EthernetBonjour.addServiceRecord("UDP._telemetry", 8888, MDNSServiceUDP);
}

void loop() { 
  EthernetBonjour.run();
  // if there's data available, read a packet
  int packetSize = udp.parsePacket();
  if(packetSize) {
    // read the packet into packetBufffer
    udp.read(packetBuffer,UDP_TX_PACKET_MAX_SIZE);
    //if(strcmp(packetBuffer,"req") == 0) {
      udp.beginPacket(udp.remoteIP(), udp.remotePort());
      udp.write(message);
      message[0] = '\0';
      udp.endPacket();
    //}
  }
  
   //Motor Controller Listen
   int i=0;
   char lineBuffer[100];
    
   if(Serial.available()){
     delay(100); //pretty strong assumption is made that message will come through immedatly, may want to modify to be a bit more forgiving of time
     while( Serial.available() && i< 99) {
        lineBuffer[i++] = Serial.read();
     }
     lineBuffer[i++]='\0';
    }

    if(i>0) {
      strcat(message, lineBuffer);
      strcat(message, ", ");
    }
    
    
    
    char buf[4];
    float R,T;
    
    R=1024.0f*10000.0f/float(analogRead(0))-10000.0f;
    T=1.0f/(1.0f/298.15f+(1.0f/3380.0f)*log(R/10000.0f));
    T=9.0f*(T-273.15f)/5.0f+32.0f;
    dtostrf(T,2,2,buf);
    strcat(message, ", TT 1");
    strcat(message, buf);
    
    R=1024.0f*10000.0f/float(analogRead(1))-10000.0f;
    T=1.0f/(1.0f/298.15f+(1.0f/3380.0f)*log(R/10000.0f));
    T=9.0f*(T-273.15f)/5.0f+32.0f;
    dtostrf(T,2,2,buf);
    strcat(message, ", TT 2");
    strcat(message, buf);
    
  
     Serial.println(message);
     message[900] = '\0';
}
