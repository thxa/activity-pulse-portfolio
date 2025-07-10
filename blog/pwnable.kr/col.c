#include <stdio.h>
#include <string.h>
unsigned long hashcode = 0x21DD09EC;
unsigned long check_password(const char* p){
        int* ip = (int*)p;
        printf("%d\n", ip[1]);
        int i;
        int res=0;
        for(i=0; i<5; i++){
                res += ip[i];
        }
        return res;
}


int main() {
    printf("%dl\n", check_password("AAAAA"));
}
// AAAAAAAAAAAAAAAAAAAA
