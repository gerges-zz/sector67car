#ifndef HASHSET_H
#define HASHSET_H

#include <WProgram.h>

template<typename hash,typename map>
class HashType {
public:
	HashType(){ reset(); }
	
	HashType(hash code,map value):hashCode(code),mappedValue(value){}
	
	void reset(){ hashCode = 0; mappedValue = 0; }
	hash getHash(){ return hashCode; }
	void setHash(hash code){ hashCode = code; }
	map getValue(){ return mappedValue; }
	void setValue(map value){ mappedValue = value; }
        boolean isSet(){return set;}
	
	HashType& operator()(hash code, map value){
		setHash( code );
		setValue( value );
                set = true;
	}
private:
	hash hashCode;
	map mappedValue;
        boolean set;
};

template<typename hash,typename map>
class HashSet {
public:
	HashSet(HashType<hash,map>* newMap,byte newSize){
		hashSet = newMap;
		size = newSize;
		for (byte i=0; i<size; i++){
			hashSet[i].reset();
		}
	}
	
	HashType<hash,map>& operator[](int x){
		//TODO - bounds
		return hashSet[x];
	}
	
	byte getIndexOf( hash key ){
		for (byte i=0; i<size; i++){
			if (hashSet[i].getHash()==key){
				return i;
			}
		}
	}
	map getValueOf( hash key ){
		for (byte i=0; i<size; i++){
			if (hashSet[i].getHash()==key){
				return hashSet[i].getValue();
			}
		}
	}
	void put( hash key, map value ){
                for (byte i=0; i<size; i++){
			if (hashSet[i].isSet() && hashSet[i].getHash()==key){
				hashSet[i](key, value);
                                return;
			}
		}
                for (byte i=0; i<size; i++){
                   if(hashSet[i] .isSet() == false) {
                      hashSet[i](key, value);
                      return;
                   }
               }
	}
	
	void debug(){
		for (byte i=0; i<size; i++){
                    if(hashSet[i].isSet()) {
			Serial.print(hashSet[i].getHash());
			Serial.print(" - ");
			Serial.println(hashSet[i].getValue());
                    }
		}
	}

private:
	HashType<hash,map>* hashSet;
	byte size;
};

#endif
