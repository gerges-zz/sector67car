#include <SPI.h>
#include <Ethernet.h>
#include <EthernetBonjour.h>
#include <EthernetUdp.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte ip[] = { 169, 254, 86, 154 };

EthernetUDP udp;

char packetBuffer[UDP_TX_PACKET_MAX_SIZE];
char  reply[] = "acknowledged";   

void setup() {
  Ethernet.begin(mac, ip);
  udp.begin(8888);
  Serial.begin(9600);
  
  EthernetBonjour.begin("telemetry-arduino");
  EthernetBonjour.addServiceRecord("UDP._telemetry", 8888, MDNSServiceUDP);
}

void loop() { 
  //EthernetBonjour.run();
  // if there's data available, read a packet
  int packetSize = udp.parsePacket();
  if(packetSize) {
    // read the packet into packetBufffer
    udp.read(packetBuffer,UDP_TX_PACKET_MAX_SIZE);
    if(strcmp(packetBuffer,"req") == 0) {
      //request found
    }
    
    // send a reply, to the IP address and port that sent us the packet we received
    udp.beginPacket(udp.remoteIP(), udp.remotePort());
    udp.write(reply);
    udp.endPacket();
  }
}
