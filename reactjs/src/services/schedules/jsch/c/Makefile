CC=gcc -std=c99

build: scheduler.c
	$(CC) -c -fpic scheduler.c -O3
	$(CC) -shared -o libjsch.so scheduler.o /usr/lib/liblpsolve55.so -Wl,-rpath,/usr/lib/ -O3

test: main.c scheduler.c
	$(CC) -o main main.c scheduler.c -llpsolve55 -lcolamd -o main -lm -ldl -O3

testdynlink: main.c
	$(CC) -o main main.c -L. -l:libjsch.so -Wl,-rpath,.

testdebug: main.c scheduler.c
	$(CC) -o main main.c scheduler.c -llpsolve55 -lcolamd -o main -lm -ldl -fno-stack-protector -g
