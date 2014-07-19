# This script plots the hypotrochoid equations, also known as spirograph or Guilloche patterns.
from numpy import sin, cos, linspace,pi
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure()
ax = fig.add_subplot(111,projection='3d')

def sinParam(average,amplitude,nCycles,nPoints):
	t = linspace(0,2*pi,nPoints)
	return amplitude*average*sin(nCycles*t)+average


a = 88  # radius of fixed circle

b = 0.05    # radius of rolling circle
h = 100  # distance from P (the tracing point) to center of rolling circle
n = 1005 # number of points to plot
m = 1    # time/angle multiplier
r = [0,2*pi]   # range of parameter/angle to plot
sf = 2.5 # scaling factor
t = linspace(r[0],r[1],n) #time/angle parameter 
# h = sinParam(100,.5,4,n)
# m = sinParam(1,.0001,3,n)
# b = sinParam(0.05,.5,30,n)

x = sf*((a-b)*cos(m*t)+h*cos(m*((a-b)/b)*t))
y = sf*((a-b)*sin(m*t)-h*sin(m*((a-b)/b)*t))


# [plt.plot(x[i:i+2],y[i:i+2],'r-',alpha=0.3) for i in range(len(x))]
# plt.axis('equal')
# plt.show()
import numpy
for zi in numpy.linspace(0,1,15):
	[ax.plot(x[i:i+2],y[i:i+2],zi,'r-',alpha=0.01) for i in range(len(x))]
	
plt.show()